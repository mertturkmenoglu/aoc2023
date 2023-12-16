import { Expect } from '../../../lib/dec';
import { AbstractSolution } from '../../../lib/types';

export class Solution extends AbstractSolution {
  toNum(s: string): number[] {
    return s
      .split(' ')
      .filter((x) => x !== '')
      .map((x) => +x);
  }

  parseLine(line: string): [number[], number[]] {
    const [w, o] = line.split(':')[1]!.split('|');
    return [this.toNum(w!), this.toNum(o!)];
  }

  matches([w, o]: [number[], number[]]): number {
    return new Set(o.filter((x) => w.includes(x))).size;
  }

  @Expect(22_897)
  override solve1(): string | number {
    let sum = 0;

    for (const line of this.lines) {
      sum += Math.floor(Math.pow(2, this.matches(this.parseLine(line)) - 1));
    }

    return sum;
  }

  @Expect(5_095_824)
  override solve2(): string | number {
    const m = new Array(this.lines.length).fill(1);

    for (let i = 0; i < m.length; i++) {
      const count = this.matches(this.parseLine(this.lines[i]!));
      for (let j = 1; j <= count; j++) {
        m[i + j] = m[i + j] + m[i];
      }
    }

    return m.reduce((acc, x) => acc + x, 0);
  }
}
