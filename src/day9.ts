function parseInput(lines: string[]): number[][] {
  return lines.map((line) => line.trim().split(' ').map(x => +x.trim()));
}

function diff(arr: number[]): number[] {
  const res: number[] = [];

  for (let i = 1; i < arr.length; i++) {
    res.push(arr[i]! - arr[i-1]!);
  }

  return res;
}

function nextValue(history: number[]): number {
  const list: number[] = [history[history.length - 1]!];
  let tmp: number[] = diff(history);

  while (!tmp.every(x => x === 0)) {
    list.push(tmp[tmp.length - 1]!);
    tmp = diff(tmp);
  }

  return list.reduce((acc, x) => acc + x, 0);
}

function prevValue(history: number[]): number {
  const list: number[] = [history[0]!];
  let tmp = diff(history), prev = 0;

  while (!tmp.every(x => x === 0)) {
    list.push(tmp[0]!);
    tmp = diff(tmp);
  }

  for (let i = list.length - 1; i >= 0; i--) {
    prev = list[i]! - prev;
  }

  return prev;
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
