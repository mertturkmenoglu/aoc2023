export function sum(arr: number[]): number {
  return arr.reduce((acc, x) => acc + x, 0);
}

export function isNumberString(s: string): boolean {
  return !isNaN(parseFloat(s));
}

export type Grid<T> = T[][];

export type Pos = [number, number];
