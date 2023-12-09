function parseLine(line: string): number[] {
  return line.trim().split(' ').map(x => +x.trim());
}

function parseInput(lines: string[]): number[][] {
  return lines.map(parseLine);
}

function diff(arr: number[]): number[] {
  const res: number[] = [];

  for (let i = 1; i < arr.length; i++) {
    res.push(arr[i]! - arr[i-1]!);
  }

  return res;
}

function nextValue(history: number[]): number {
  const list: number[][] = [];
  list.push([...history]);
  let tmp: number[] = diff(history);

  while (!tmp.every(x => x === 0)) {
    list.push([...tmp]);
    tmp = diff(tmp);
  }

  return list.map(x => x[x.length - 1]!).reduce((acc, x) => acc + x, 0);
}

export const expected1 = 1_995_001_648;
export function solve1(lines: string[]): number {
  const input = parseInput(lines);
  let sum = 0;

  for (const line of input) {
    const next = nextValue(line);
    sum += next;
  }

  return sum;
}

export const expected2 = 0;
export function solve2(lines: string[]): number {
  return lines.length;
}
