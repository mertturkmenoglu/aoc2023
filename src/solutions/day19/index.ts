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
  parseCondition(s: string): Condition {
    if (!s.includes(':')) {
      return { target: s };
    }

    const [condStr, target] = s.split(':') as [string, string];
    const op = condStr.includes('>') ? '>' : '<';
    const [varstr, valstr] = condStr.split(op);

    const isField = (str: string): str is Field => {
      return str === 'x' || str === 'm' || str === 'a' || str === 's';
    };

    if (varstr === undefined || !isField(varstr)) {
      throw new Error('invalid input');
    }

    return {
      target,
      op,
      var: varstr,
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
    const processorsSec: string[] = [];

    for (const line of this.lines) {
      if (line !== '') {
        processorsSec.push(line);
      } else {
        break;
      }
    }

    const inputSec: string[] = [];
    for (let i = processorsSec.length + 1; i < this.lines.length; i++) {
      inputSec.push(this.lines[i]!);
    }

    const p: Record<string, Condition[]> = {};

    for (const [l, c] of this.parseProcessors(processorsSec)) {
      p[l] = c;
    }

    return {
      processors: p,
      inputs: this.parseInputs(inputSec),
    };
  }

  workflow(input: Input, processors: Record<string, Condition[]>): number {
    let label = 'in';

    while (label !== 'A' && label !== 'R') {
      const conditions = processors[label] ?? [];

      for (const cond of conditions) {
        if (cond.op !== undefined) {
          const field = cond.var!;
          const val = cond.val!;

          const check =
            cond.op === '<' ? input[field] < val : input[field] > val;

          if (check) {
            label = cond.target;
            break;
          }
        } else {
          label = cond.target;
          break;
        }
      }
    }

    if (label === 'R') {
      return 0;
    }

    return input.x + input.m + input.a + input.s;
  }

  compute(fi: FileInput): number {
    const results = fi.inputs.map((inp) => this.workflow(inp, fi.processors));
    return sum(results);
  }

  @Expect(383_682)
  override solve1(): string | number {
    const fi = this.parseInput();
    return this.compute(fi);
  }

  @Expect(0)
  override solve2(): string | number {
    return 0;
  }
}
