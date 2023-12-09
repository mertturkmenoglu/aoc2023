let input: number[][] | null = null;

function parseInput(lines: string[]): number[][] {
  if (!input) {
    input = lines.map((line) => line.trim().split(' ').map(x => +x.trim()));
  }
  return input;
}

function diff(arr: number[]): number[] {
  return new Array(arr.length).fill(0).map((_, i) => i).slice(1).map(i => arr[i]! - arr[i - 1]!);
}

function steps(history: number[], type: 'next' | 'prev'): number[] {
  const i = type === 'next' ? -1 : 0;
  const list = [history.at(i)!];
  let tmp = diff(history);

  while (!tmp.every(x => x === 0)) {
    list.push(tmp.at(i)!);
    tmp = diff(tmp);
  }

  return list;
}

function nextValue(history: number[]): number {
  const list = steps(history, 'next');
  return list.reduce((acc, x) => acc + x, 0);
}

function prevValue(history: number[]): number {
  const list = steps(history, 'prev');
  return new Array(list.length).fill(0).map((_, i, arr) => arr.length - i - 1).reduce((acc, i) => list[i]! - acc, 0);
}

export const expected1 = 1_995_001_648;
export function solve1(lines: string[]): number {
  const input = parseInput(lines);
  return input.reduce((acc, x) => acc + nextValue(x), 0);
}

export const expected2 = 988;
export function solve2(lines: string[]): number {
  const input = parseInput(lines);
  return input.reduce((acc, x) => acc + prevValue(x), 0);
}
