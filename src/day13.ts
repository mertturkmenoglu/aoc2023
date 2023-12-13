type Matrix = string[][];

type Input = Matrix[];

type Reflection = { row: number | null, col: number | null; };

function hash(s: string[]): number {
  const changed = s.map(ch => ch === '#' ? '1' : '0').join('');
  return parseInt(changed, 2);
}

function symmetryPoint(arr: number[]): number | null {
  for (let i = 0; i < arr.length - 1; i++) {
    let j = 0;
    let flag = true;
    let bound = true;

    while (flag && bound) {
      let lo = i - j;
      let hi = i + j + 1;

      if (lo < 0 || hi >= arr.length) {
        bound = false;
      } else if (arr[lo]! !== arr[hi]!) {
        flag = false;
      }

      j++;
    }

    if (!bound) {
      return i;
    }
  }

  return null;
}

function findHorizontalReflection(mtr: Matrix): number | null {
  const rows: number[] = [];

  for (let i = 0; i < mtr.length; i++) {
    rows.push(hash(mtr[i]!));
  }

  return symmetryPoint(rows);
}

function findVerticalReflection(mtr: Matrix): number | null {
  const cols: number[] = [];

  for (let i = 0; i < mtr[0]!.length; i++) {
    cols.push(hash(mtr.map(row => row[i]!)));
  }

  return symmetryPoint(cols);
}

function reflection(mtr: Matrix): Reflection {
  const horRef = findHorizontalReflection(mtr);
  const verRef = findVerticalReflection(mtr);

  return {
    row: horRef,
    col: verRef,
  };
}

function computeRefValue(mtr: Matrix): number {
  const { row, col } = reflection(mtr);
  let result = 0;

  if (row !== null) {
    result += (row + 1) * 100;
  }

  if (col !== null) {
    result += col + 1;
  }

  return result;
}

function parseInput(lines: string[]): Input {
  const input: Input = [];
  let tmp: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim();

    if (line === '') {
      input.push([...tmp.map(line => line.split(''))]);
      tmp.length = 0;
    } else {
      tmp.push(line);
    }
  }

  input.push([...tmp.map(line => line.split(''))])

  return input;
}

export const expected1 = 43614;
export function solve1(lines: string[]): number {
  const input = parseInput(lines);
  let sum = 0;

  for (const mtr of input) {
    sum += computeRefValue(mtr);
  }

  return sum;
}

export const expected2 = 0;
export function solve2(lines: string[]): number {
  return lines.length;
}