import { Expect, AbstractSolution, sum } from '../../../lib';

type Field = 'x' | 'm' | 'a' | 's';

type Input = Record<Field, number>;

interface Condition {
  var?: Field;
  op?: string;
  val?: number;
  target: string;
}

interface FileInput {
  processors: Record<string, Condition[]>;
  inputs: Input[];
}

export class Solution extends AbstractSolution {
  private processors: Record<string, Condition[]> = {};

  parseCondition(s: string): Condition {
    if (!s.includes(':')) {
      return { target: s };
    }

    const [condStr, target] = s.split(':') as [string, string];
    const op = condStr.includes('>') ? '>' : '<';
    const [field, valstr] = condStr.split(op);

    const isField = (str: string): str is Field => {
      return str === 'x' || str === 'm' || str === 'a' || str === 's';
    };

    if (field === undefined || !isField(field)) {
      throw new Error('invalid input');
    }

    return {
      target,
      op,
      var: field,
      val: +valstr!,
    };
  }

  parseProcessors(sec: string[]): Array<[string, Condition[]]> {
    return sec.map((line) => {
      let [label, conditionsSec] = line.split('{');
      conditionsSec = conditionsSec!.substring(0, conditionsSec!.length - 1);
      return [
        label!,
        conditionsSec.split(',').map((x) => this.parseCondition(x)),
      ];
    });
  }

  parseInputs(sec: string[]): Input[] {
    return sec
      .map((s) => s.substring(1, s.length - 1))
      .map((line) => {
        const v = line.split(',').map((p) => +p.split('=')[1]!);
        return {
          x: v[0]!,
          m: v[1]!,
          a: v[2]!,
          s: v[3]!,
        };
      });
  }

  parseInput(): FileInput {
    const i = this.lines.findIndex((l) => l === '');
    const processorsSec = this.lines.slice(0, i);
    const inputSec: string[] = this.lines.slice(processorsSec.length + 1);

    const p: Record<string, Condition[]> = {};

    for (const [l, c] of this.parseProcessors(processorsSec)) {
      p[l] = c;
    }

    return {
      processors: p,
      inputs: this.parseInputs(inputSec),
    };
  }

  acceptable(input: Input, label = 'in'): boolean {
    if (label === 'A' || label === 'R') {
      return label === 'A';
    }

    const conditions = this.processors[label] ?? [];
    const conds = conditions.slice(0, conditions.length - 1);
    const fallback = conditions.at(-1)!;

    for (const cond of conds) {
      if (cond.op !== undefined) {
        const check =
          cond.op === '<'
            ? input[cond.var!] < cond.val!
            : input[cond.var!] > cond.val!;

        if (check) {
          return this.acceptable(input, cond.target);
        }
      }
    }

    return this.acceptable(input, fallback.target);
  }

  compute(fi: FileInput): number {
    const results = fi.inputs
      .filter((inp) => this.acceptable(inp))
      .map((x) => {
        return sum(Object.values(x));
      });
    return sum(results);
  }

  @Expect(383_682)
  override solve1(): string | number {
    const fi = this.parseInput();
    this.processors = fi.processors;
    return this.compute(fi);
  }

  @Expect(0)
  override solve2(): string | number {
    return 0;
  }
}
