import fs from 'node:fs';

function solve1(lines: string[]): number {
  let sum = 0;

  for (const line of lines) {
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

type NumPos = {
  num: number;
  pos: number;
}

function solve2(lines: string[]): number {
  const numsAsString = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  let sum = 0;

  for (const line of lines) {
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

export function day1() {
  const lines = fs.readFileSync('src/input1.txt').toString().split('\n');
  const res = [solve1(lines), solve2(lines)];
  console.log(`Day 1 result 1: ${res[0]}`);
  console.log(`Day 1 result 2: ${res[1]}`);
}
