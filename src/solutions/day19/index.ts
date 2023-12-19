import { Expect, AbstractSolution, sum } from '../../../lib';

type Field = 'x' | 'm' | 'a' | 's';

type Input = Record<Field, number>;

interface Processor {
  label: string;
  conditions: Condition[];
}

interface Condition {
  var?: Field;
  op?: string;
  val?: number;
  target: string;
}

interface FileInput {
  processors: Processor[];
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

  parseProcessors(sec: string[]): Processor[] {
    return sec.map((line) => {
      let [label, conditionsSec] = line.split('{');
      conditionsSec = conditionsSec!.substring(0, conditionsSec!.length - 1);
      return {
        label: label!,
        conditions: conditionsSec.split(',').map((x) => this.parseCondition(x)),
      };
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

    return {
      processors: this.parseProcessors(processorsSec),
      inputs: this.parseInputs(inputSec),
    };
  }

  workflow(input: Input, processors: Processor[]): number {
    let label = 'in';
    let ended = false;
    let accepted = false;

    while (!ended) {
      const processor = processors.find((p) => p.label === label)!;

      for (const cond of processor.conditions) {
        if (cond.op !== undefined) {
          const varName = cond.var!;
          const op = cond.op;
          const val = cond.val!;

          const check =
            op === '<' ? input[varName] < val : input[varName] > val;

          if (check) {
            label = cond.target;
            if (label === 'A' || label === 'R') {
              ended = true;
              accepted = label === 'A';
            }
            break;
          }
        } else {
          if (cond.target === 'A' || cond.target === 'R') {
            ended = true;
            accepted = cond.target === 'A';
            break;
          } else {
            label = cond.target;
            break;
          }
        }
      }
    }

    if (!accepted) {
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
