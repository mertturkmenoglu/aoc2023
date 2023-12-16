import { AbstractSolution, Expect, isNumberString, sum } from '../../../lib';

interface NumPos {
  num: number;
  pos: number;
}

export class Solution extends AbstractSolution {
  numsAsString = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
  ];

  compute(line: string): number {
    let first = -1;
    let last = -1;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i]!;

      if (isNumberString(ch)) {
        if (first === -1) {
          first = +ch;
        }

        last = +ch;
      }
    }

    return first * 10 + last;
  }

  compute2(line: string): number {
    const nums: NumPos[] = [];

    // Check for Arabic numerals
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]!;

      if (isNumberString(ch)) {
        nums.push({ num: +ch, pos: i });
      }
    }

    // Check for spelling
    for (let i = 0; i < this.numsAsString.length; i++) {
      const spell = this.numsAsString[i]!;
      const pos1 = line.lastIndexOf(spell);
      const pos2 = line.indexOf(spell);

      if (pos1 !== -1) {
        nums.push({ num: i + 1, pos: pos1 });
      }

      if (pos2 !== -1) {
        nums.push({ num: i + 1, pos: pos2 });
      }
    }

    nums.sort((a, b) => a.pos - b.pos);

    const first = nums[0]!.num;
    const last = nums[nums.length - 1]!.num;

    return first * 10 + last;
  }

  @Expect(54697)
  solve1(): number {
    return sum(this.lines.map((line) => this.compute(line)));
  }

  @Expect(54885)
  solve2(): number {
    return sum(this.lines.map((line) => this.compute2(line)));
  }
}
