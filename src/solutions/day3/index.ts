/* eslint-disable @typescript-eslint/strict-boolean-expressions */
const sym = (s: string): boolean => s !== '.';
const num = (s: string | undefined): s is string => !!s && !isNaN(parseInt(s));
const check = (lines: string[], i: number, j: number): boolean =>
  num(lines[i]?.[j]);
const set = (
  lines: string[],
  i: number,
  arr: string[],
  s: number,
  e: number,
  idx: number,
): void => {
  if (num(lines[i]!.substring(s, e))) {
    arr[idx] = lines[i]!.substring(s, e);
  }
};
const pred = (a: Array<string | undefined>): boolean =>
  a.some((c) => !!c && sym(c));

function isAdj(l: string[], i: number, s: number, e: number): boolean {
  return (
    pred([l[i]?.[s - 1], l[i]?.[e]]) ||
    [...Array(e - s + 2).keys()]
      .map((x) => x + s - 1)
      .some((j) => pred([l[i - 1]?.[j], l[i + 1]?.[j]]))
  );
}

function getAdjNums(l: string[], i: number, j: number): number[] {
  const s: string[] = ['', ''];
  let jj = j - 1;
  while (check(l, i, jj)) {
    jj--;
  }
  set(l, i, s, jj + 1, j, 0);
  jj = j + 1;
  while (check(l, i, jj)) {
    jj++;
  }
  set(l, i, s, j + 1, jj, 1);
  return num(l[i]?.[j])
    ? [+`${s[0]}${l[i]?.[j]}${s[1]}`]
    : s.filter((x) => !!x).map((x) => +x);
}

function getGearRatio(l: string[], i: number, j: number): number {
  const adj: number[] = [];
  const pushSub = (s: number, e: number): void => {
    if (num(l[i]?.substring(s, e))) {
      adj.push(+l[i]!.substring(s, e));
    }
  };
  let jj = j - 1;
  while (check(l, i, jj)) {
    jj--;
  }
  pushSub(jj + 1, j);
  jj = j + 1;
  while (check(l, i, jj)) {
    jj++;
  }
  pushSub(j + 1, jj);
  adj.push(...getAdjNums(l, i - 1, j), ...getAdjNums(l, i + 1, j));
  return adj.length === 2 ? adj[0]! * adj[1]! : -1;
}

export const expected1 = 537732;
export function solve1(lines: string[]): number {
  return lines.reduce((acc, line, i) => {
    let j = 0;
    let sum = 0;
    while (j < line.length) {
      if (num(line[j])) {
        const start = j;
        while (num(line[j])) {
          j++;
        }
        sum += isAdj(lines, i, start, j) ? +line.substring(start, j) : 0;
      }
      j++;
    }
    return acc + sum;
  }, 0);
}

export const expected2 = 84883664;
export function solve2(lines: string[]): number {
  let sum = 0;

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i]!.length; j++) {
      if (lines[i]![j]! === '*') {
        const r = getGearRatio(lines, i, j);
        sum += r !== -1 ? r : 0;
      }
    }
  }

  return sum;
}
