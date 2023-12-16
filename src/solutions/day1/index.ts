import { AbstractSolution, Expect } from '../../../lib';

interface NumPos {
  num: number;
  pos: number;
}

export class Solution extends AbstractSolution {
  @Expect(54697)
  solve1(): number {
    let sum = 0;

    for (const line of this.lines) {
      let first = -1;
      let last = -1;

      for (let i = 0; i < line.length; i++) {
        const ch = line[i]!;
        const convertedValue = parseInt(ch);

        if (isNaN(convertedValue)) {
          continue;
        }

        if (first === -1) {
          first = convertedValue;
        }

        last = convertedValue;
      }

      const twoDigitNumber = first * 10 + last;
      sum += twoDigitNumber;
    }

    return sum;
  }

  @Expect(54885)
  solve2(): number {
    const numsAsString = [
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
    let sum = 0;

    for (const line of this.lines) {
      const nums: NumPos[] = [];

      // Check for Arabic numerals
      for (let i = 0; i < line.length; i++) {
        const ch = line[i]!;
        const convertedValue = parseInt(ch);

        if (isNaN(convertedValue)) {
          continue;
        }

        nums.push({ num: convertedValue, pos: i });
      }

      // Check for spelling
      for (let i = 0; i < numsAsString.length; i++) {
        const spell = numsAsString[i]!;
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

      const twoDigitNumber = first * 10 + last;
      sum += twoDigitNumber;
    }

    return sum;
  }
}
