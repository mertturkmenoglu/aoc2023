import { assert } from 'node:console';
import fs from 'node:fs';

function isSymbol(ch: string): boolean {
  return ch !== '.';
}

function isNumber(s: string | undefined): boolean {
  return !!s && !isNaN(parseInt(s));
}

function isAdjacentToSymbol(lines: string[], i: number, startIndex: number, endIndex: number): boolean {
  // Check sides
  const pred = (a: (string | undefined)[]): boolean => a.some((ch) => !!ch && isSymbol(ch));
  const chars = [lines[i]![startIndex - 1], lines[i]![endIndex]];

  if (pred(chars)) {
    return true;
  }

  for (let j = startIndex - 1; j < endIndex + 1; j++) {
    const chars = [lines[i-1]?.[j], lines[i+1]?.[j]];
    if (pred(chars)) {
      return true;
    }
  }

  return false;
}

function getAdjNums(lines: string[], i: number, j: number): number[] {
  let l = '', r = '', jj = j + 1;

  while (isNumber(lines[i]?.[jj]) && j >= 0) { jj++; }
  const prsub = lines[i]?.substring(j + 1, jj);
  if (!!prsub && isNumber(prsub)) { r = prsub; }

  jj = j - 1;
  while (isNumber(lines[i]?.[jj])) { jj--; }
  const plsub = lines[i]?.substring(jj + 1, j);
  if (!!plsub && isNumber(plsub)) { l = plsub; }

  const ch = lines[i]?.[j];
  if (!!ch && isNumber(ch)) {
    const newStr = `${l}${ch}${r}`;
    return [+newStr];
  }

  return [l, r].filter(x => x !== '').map(x => +x);
}

function getGearRatio(lines: string[], i: number, j: number): number {
  const adj: number[] = [];
  let jj = 0, sub = '';

  jj = j - 1;
  while (isNumber(lines[i]![jj]) && j >= 0) { jj--; }
  sub = lines[i]!.substring(jj + 1, j);
  if (isNumber(sub)) { adj.push(+sub); }

  jj = j + 1;
  while (isNumber(lines[i]![jj])) { jj++ }
  sub = lines[i]!.substring(j + 1, jj);
  if (isNumber(sub)) { adj.push(+sub); }

  adj.push(...getAdjNums(lines, i - 1, j), ...getAdjNums(lines, i + 1, j))

  return adj.length === 2 ? adj[0]! * adj[1]! : -1;
}

function solve1(lines: string[]): number {
  return lines.reduce((acc, line, i) => {
    let j = 0, sum = 0;
    while (j < line.length) {
      if (isNumber(line[j]!)) {
        const start = j;

        while (isNumber(line[j]!)) {
          j++;
        }

        if (isAdjacentToSymbol(lines, i, start, j)) {
          sum += +line.substring(start, j);
        }
      }
      j++;
    }
    return acc + sum;
  }, 0);
}

function solve2(lines: string[]): number {
  let sum = 0;

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i]!.length; j++) {
      if (lines[i]![j]! === '*') {
        const gearRatio = getGearRatio(lines, i, j);
        
        if (gearRatio !== -1) {
          sum += gearRatio;
        }
      }
    }
  }

  return sum;
}

export function day3() {
  const lines = fs.readFileSync('src/input3.txt').toString().split('\n');
  const res = [solve1(lines), solve2(lines)];
  console.log(`Day 3 result 1: ${res[0]}`);
  console.log(`Day 3 result 2: ${res[1]}`);
  assert(res[0] === 537732, 'part 1');
  assert(res[1] === 84883664, 'part 2');
}
