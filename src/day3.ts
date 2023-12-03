import fs from 'node:fs';

function isSymbol(ch: string): boolean {
  return ch !== '.';
}

function isNumber(s: string | undefined): boolean {
  return !!s && !isNaN(parseInt(s));
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

function getGearRatio(lines: string[], i: number, j: number): number {
  const adjacentNumbers: number[] = [];
  const line = lines[i]!;
  let jj = 0;
  let ii = 0;

  // Check right side
  jj = j + 1;
  while (isNumber(line[jj])) { jj++ }
  const rsub = line.substring(j + 1, jj);
  if (isNumber(rsub)) { adjacentNumbers.push(+rsub); }

  // Chech left side
  jj = j - 1;
  while (isNumber(line[jj]) && j >= 0) { jj--; }
  const lsub = line.substring(jj + 1, j);
  if (isNumber(lsub)) { adjacentNumbers.push(+lsub); }

  let pr: string | null = null;
  let pl: string | null = null;

  // Check for previous line
  ii = i - 1;
  jj = j + 1;
  while (isNumber(lines[ii]?.[jj]) && j >= 0) { jj++; }
  const prsub = lines[ii]?.substring(j + 1, jj);
  if (!!prsub && isNumber(prsub)) { pr = prsub; }

  jj = j - 1;
  while (isNumber(lines[ii]?.[jj])) { jj--; }
  const plsub = lines[ii]?.substring(jj + 1, j);
  if (!!plsub && isNumber(plsub)) { pl = plsub; }

  const topChar = lines[ii]?.[j];
  if (!!topChar && isNumber(topChar)) {
    const newStr = `${pl !== null ? pl : ''}${topChar}${pr !== null ? pr : ''}`;
    adjacentNumbers.push(+newStr);
  } else {
    if (pl !== null) {
      adjacentNumbers.push(+pl);
    }

    if (pr !== null) {
      adjacentNumbers.push(+pr);
    }
  }

  // Check for next line
  let nr: string | null = null;
  let nl: string | null = null;
  ii = i + 1;
  jj = j + 1;
  while (isNumber(lines[ii]?.[jj]) && j >= 0) { jj++; }
  const nrsub = lines[ii]?.substring(j + 1, jj);
  if (!!nrsub && isNumber(nrsub)) { nr = nrsub; }

  jj = j - 1;
  while (isNumber(lines[ii]?.[jj])) { jj--; }
  const nlsub = lines[ii]?.substring(jj + 1, j);
  if (!!nlsub && isNumber(nlsub)) { nl = nlsub; }

  const botChar = lines[ii]?.[j];
  if (!!botChar && isNumber(botChar)) {
    const newStr = `${nl !== null ? nl : ''}${botChar}${nr !== null ? nr : ''}`;
    adjacentNumbers.push(+newStr);
  } else {
    if (nl !== null) {
      adjacentNumbers.push(+nl);
    }

    if (nr !== null) {
      adjacentNumbers.push(+nr);
    }
  }

  // Check if gear then return ratio else return -1
  if (adjacentNumbers.length === 2) {
    return adjacentNumbers[0]! * adjacentNumbers[1]!;
  }

  return -1;
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

      while (isNumber(line[j]!)) {
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
}
