const parseInput = (lines: string[]): number[][] =>
  lines.map((line) => line.split(' ').map(Number));

const diff = (arr: number[]): number[] =>
  new Array(arr.length)
    .fill(0)
    .map((_, i) => i)
    .slice(1)
    .map((i) => arr[i]! - arr[i - 1]!);

function diffs(history: number[], type: 'next' | 'prev'): number[] {
  const i = type === 'next' ? -1 : 0;
  const list = [history.at(i)!];
  let tmp = diff(history);

  while (!tmp.every((x) => x === 0)) {
    list.push(tmp.at(i)!);
    tmp = diff(tmp);
  }

  return list;
}

const nextValue = (history: number[]): number =>
  diffs(history, 'next').reduce((acc, x) => acc + x, 0);

function prevValue(history: number[]): number {
  const list = diffs(history, 'prev');
  return new Array(list.length)
    .fill(0)
    .map((_, i, arr) => arr.length - i - 1)
    .reduce((acc, i) => list[i]! - acc, 0);
}

export const expected1 = 1_995_001_648;
export const solve1 = (lines: string[]): number =>
  parseInput(lines).reduce((acc, x) => acc + nextValue(x), 0);

export const expected2 = 988;
export const solve2 = (lines: string[]): number =>
  parseInput(lines).reduce((acc, x) => acc + prevValue(x), 0);
