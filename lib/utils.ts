export function sum(arr: number[]): number {
  return arr.reduce((acc, x) => acc + x, 0);
}

export function prod(arr: number[]): number {
  return arr.reduce((acc, x) => acc * x, 1);
}

export function isNumberString(s: string): boolean {
  return !isNaN(parseFloat(s));
}

export function gcd(a: number, b: number): number {
  let temp = b;

  while (b !== 0) {
    b = a % b;
    a = temp;
    temp = b;
  }

  return a;
}

export function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

export type TGrid<T> = T[][];

export type Pos = [number, number];

export const hvAdjMap: Pos[] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export const adjMap: Pos[] = [...hvAdjMap, [-1, -1], [-1, 1], [1, -1], [1, 1]];

export class Grid<T> {
  private mtr: T[][] = [];

  constructor(list: T[][] = []) {
    this.mtr = list;
  }

  create(dim: [number, number], fill: T): Grid<T> {
    this.mtr = new Array(dim[0])
      .fill(0)
      .map(() => new Array(dim[1]).fill(fill));
    return this;
  }

  getRow(i: number): T[] {
    return this.mtr[i]!;
  }

  getCol(i: number): T[] {
    return this.mtr.map((row) => row[i]!);
  }

  at(row: number, col: number): T {
    return this.mtr[row]![col]!;
  }

  atPos(pos: Pos): T {
    return this.at(pos[0], pos[1]);
  }

  set(row: number, col: number, v: T): void {
    this.mtr[row]![col] = v;
  }

  setPos(pos: Pos, v: T): void {
    this.set(pos[0], pos[1], v);
  }

  dims(): [row: number, col: number] {
    return [this.mtr.length, this.mtr[0]!.length];
  }

  isPosInGrid(pos: Pos): boolean {
    const [row, col] = pos;
    const [rowCount, colCount] = this.dims();

    if (row < 0 || row >= rowCount) {
      return false;
    }

    if (col < 0 || col >= colCount) {
      return false;
    }

    return true;
  }

  isValueInGrid(v: T): boolean {
    const [row, col] = this.dims();

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        if (this.at(i, j) === v) {
          return true;
        }
      }
    }

    return false;
  }

  getPosOfValue(v: T): Pos | null {
    const [row, col] = this.dims();

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        if (this.at(i, j) === v) {
          return [i, j];
        }
      }
    }

    return null;
  }

  hash(): string {
    return this.toString();
  }

  toString(): string {
    return JSON.stringify(this.mtr);
  }

  equal(other: Grid<T>): boolean {
    return JSON.stringify(this) === JSON.stringify(other);
  }
}
