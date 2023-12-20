import { Expect, AbstractSolution } from '../../../lib';

type ModuleType = 'broadcast' | 'flipflop' | 'conjuction';

type SignalStrength = 'high' | 'low';

interface Module {
  type: ModuleType;
  targets: string[];
  signals: Record<string, SignalStrength>;
  status: 'on' | 'off';
}

interface Signal {
  from: string;
  to: string;
  strength: SignalStrength;
}

export class Solution extends AbstractSolution {
  private modules: Record<string, Module> = {};
  private broadcastTargets: string[] = [];

  parseInput(): void {
    for (const line of this.lines) {
      const startChar = line.charAt(0);

      const [namestr, targetsstr] = line.split(' -> ');
      const targets = targetsstr!
        .trim()
        .split(',')
        .filter((x) => x !== '')
        .map((x) => x.trim());

      const type: ModuleType =
        startChar === '%'
          ? 'flipflop'
          : startChar === '&'
            ? 'conjuction'
            : 'broadcast';

      const name = type === 'broadcast' ? namestr! : namestr!.substring(1);

      if (type !== 'broadcast') {
        this.modules[name] = {
          type,
          targets,
          signals: {},
          status: 'off',
        };
      } else {
        this.broadcastTargets = targets;
      }
    }
  }

  compute(): number {
    for (const [name, module] of Object.entries(this.modules)) {
      for (const target of module.targets) {
        if (
          Object.keys(this.modules).includes(target) &&
          this.modules[target]!.type === 'conjuction'
        ) {
          this.modules[target]!.signals[name] = 'low';
        }
      }
    }

    let lowCounter = 0;
    let highCounter = 0;

    for (let i = 0; i < 1000; i++) {
      lowCounter++;
      const q: Signal[] = this.broadcastTargets.map((to) => ({
        from: 'broadcaster',
        to,
        strength: 'low',
      }));

      while (q.length > 0) {
        const { from, to, strength } = q.shift()!;

        if (strength === 'high') {
          highCounter++;
        } else {
          lowCounter++;
        }

        if (!Object.keys(this.modules).includes(to)) {
          continue;
        }

        const mod = this.modules[to]!;

        if (mod.type === 'flipflop') {
          if (strength === 'low') {
            mod.status = mod.status === 'on' ? 'off' : 'on';
            for (const t of mod.targets) {
              q.push({
                from: to,
                to: t,
                strength: mod.status === 'on' ? 'high' : 'low',
              });
            }
          }
        } else {
          mod.signals[from] = strength;
          const allHigh = Object.values(mod.signals).every((v) => v === 'high');
          const newStr: SignalStrength = allHigh ? 'low' : 'high';
          for (const t of mod.targets) {
            q.push({
              from: to,
              to: t,
              strength: newStr,
            });
          }
        }
      }
    }

    return lowCounter * highCounter;
  }

  @Expect(763_500_168)
  override solve1(): string | number {
    this.parseInput();
    return this.compute();
  }

  @Expect(0)
  override solve2(): string | number {
    return 0;
  }
}
