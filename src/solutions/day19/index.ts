import { Expect, AbstractSolution, sum, prod } from '../../../lib';

type Field = 'x' | 'm' | 'a' | 's';

type IncRange = [number, number];

type Input = Record<Field, number>;

interface CompCond {
  field: Field;
  op: string;
  val: number;
  target: string;
}

interface FallbackCond {
  target: string;
}

type Condition = CompCond | FallbackCond;

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

    return {
      target,
      op,
      field: field! as Field,
      val: +valstr!,
    };
  }

  parseProcessors(sec: string[]): Record<string, Condition[]> {
    const r: Record<string, Condition[]> = {};

    for (const line of sec) {
      const [label, conditionsSec] = line.split('{') as [string, string];
      r[label] = conditionsSec
        .substring(0, conditionsSec.length - 1)
        .split(',')
        .map((x) => this.parseCondition(x));
    }

    return r;
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

    return {
      processors: this.parseProcessors(processorsSec),
      inputs: this.parseInputs(inputSec),
    };
  }

  acceptable(input: Input, label = 'in'): boolean {
    if (label === 'A' || label === 'R') {
      return label === 'A';
    }

    const w = this.processors[label]!;
    const conds = w.slice(0, w.length - 1) as CompCond[];
    const fallback = w.at(-1)!;

    for (const cond of conds) {
      const check =
        cond.op === '<'
          ? input[cond.field] < cond.val
          : input[cond.field] > cond.val;

      if (check) {
        return this.acceptable(input, cond.target);
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

  count(ranges: Record<Field, IncRange>, label = 'in'): number {
    if (label === 'R') {
      return 0;
    }

    if (label === 'A') {
      return prod(Object.values(ranges).map(([lo, hi]) => hi - lo + 1));
    }

    const w = this.processors[label]!;
    const conditions = w.slice(0, w.length - 1) as CompCond[];
    const fallback = w.at(-1) as FallbackCond;

    let counter = 0;
    let flag = true;

    for (const { field, op, val, target } of conditions) {
      const [lo, hi] = ranges[field];

      const acceptable: IncRange = op === '<' ? [lo, val - 1] : [val + 1, hi];
      const denied: IncRange = op === '<' ? [val, hi] : [lo, val];

      if (acceptable[0] < acceptable[1]) {
        const newRanges = {
          ...ranges,
        };
        newRanges[field] = acceptable;
        counter += this.count(newRanges, target);
      }

      if (denied[0] < denied[1]) {
        ranges = { ...ranges };
        ranges[field] = denied;
      } else {
        flag = false;
        break;
      }
    }

    if (flag) {
      counter += this.count(ranges, fallback.target);
    }

    return counter;
  }

  @Expect(383_682)
  override solve1(): string | number {
    const fi = this.parseInput();
    this.processors = fi.processors;
    return this.compute(fi);
  }

  @Expect(117_954_800_808_317)
  override solve2(): string | number {
    const ranges: Record<Field, IncRange> = {
      x: [1, 4000],
      m: [1, 4000],
      a: [1, 4000],
      s: [1, 4000],
    };
    return this.count(ranges, 'in');
  }
}
