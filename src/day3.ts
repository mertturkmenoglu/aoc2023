import fs from 'node:fs';

function isSymbol(ch: string): boolean {
  return ch !== '.';
}

function isAdjacentToSymbol(lines: string[], i: number, startIndex: number, endIndex: number): boolean {
  // Check sides
  const line = lines[i]!;
  const lch = line[startIndex - 1];
  const rch = line[endIndex];

  if ((lch && isSymbol(lch)) || (rch && isSymbol(rch)))  {
    return true;
  }

  const jStart = startIndex - 1 < 0 ? 0 : startIndex - 1;

  for (let j = jStart; j < endIndex + 1; j++) {
    const pch = lines[i-1]?.[j];
    const nch = lines[i+1]?.[j];
    if ((pch && isSymbol(pch)) || (nch && isSymbol(nch))) {
      return true;
    }
  }

  return false;
}

function solve1(lines: string[]): number {
  let sum = 0;

  for (let i = 0; i < lines.length; i++) {
    let j = 0;
    const line = lines[i]!
    while (j < line.length) {
      const ch = line[j]!;
      const v = parseInt(ch);

      if (isNaN(v)) {
        j++;
        continue;
      }

      // Found a number index, loop until char is not a number
      const startIndex = j;

      while (!isNaN(parseInt(line[j]!))) {
        j++;
      }

      const endIndex = j; // Exclusive range [startIndex, endIndex)
      const n = +line.substring(startIndex, endIndex);

      if (isAdjacentToSymbol(lines, i, startIndex, endIndex)) {
        sum += n;
      }
    }
  }

  return sum;
}

function solve2(lines: string[]): number {
  let sum = lines.length;
  return sum;
}

export function day3() {
  const lines = fs.readFileSync('src/input3.txt').toString().split('\n');
  const res = [solve1(lines), solve2(lines)];
  console.log(`Day 3 result 1: ${res[0]}`);
  console.log(`Day 3 result 2: ${res[1]}`);
}
