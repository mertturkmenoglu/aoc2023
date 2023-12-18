export function sum(arr: number[]): number {
  return arr.reduce((acc, x) => acc + x, 0);
}

export function isNumberString(s: string): boolean {
  return !isNaN(parseFloat(s));
}

export type Grid<T> = T[][];

export type Pos = [number, number];

export const hvAdjMap: Pos[] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export const adjMap: Pos[] = [...hvAdjMap, [-1, -1], [-1, 1], [1, -1], [1, 1]];
