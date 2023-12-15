type Matrix = number[][];

type Input = Matrix[];

interface Reflection {
  row: number | undefined;
  col: number | undefined;
}

function parseInput(lines: string[]): Input {
  const matrices: Input = [];
  const tmp: number[][] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim();

    if (line === '') {
      matrices.push([...tmp]);
      tmp.length = 0;
    } else {
      tmp.push(line.split('').map((x) => (x === '#' ? 1 : 0)));
    }
  }

  matrices.push([...tmp]);

  return matrices;
}

function hash(s: number[]): number {
  return parseInt(s.join(''));
}

function findHorizontalReflections(mtr: Matrix): number[] {
  const rows: number[] = [];

  for (let i = 0; i < mtr.length; i++) {
    rows.push(hash(mtr[i]!));
  }

  return symmetryPoint(rows);
}

function findVerticalReflections(mtr: Matrix): number[] {
  const cols: number[] = [];

  for (let i = 0; i < mtr[0]!.length; i++) {
    cols.push(hash(mtr.map((row) => row[i]!)));
  }

  return symmetryPoint(cols);
}

function reflection(mtr: Matrix, orig?: Reflection | undefined): Reflection {
  const horRefs = findHorizontalReflections(mtr);
  const verRefs = findVerticalReflections(mtr);

  if (orig !== undefined) {
    return {
      row: horRefs.filter((r) => r !== orig.row)[0],
      col: verRefs.filter((r) => r !== orig.col)[0],
    };
  }

  return {
    row: horRefs[0],
    col: verRefs[0],
  };
}

function reflectionValue(ref: Reflection): number {
  if (ref.row !== undefined) {
    return (ref.row + 1) * 100;
  }

  if (ref.col !== undefined) {
    return ref.col + 1;
  }

  throw new Error('Invalid reflection');
}

function computeRefValue(mtr: Matrix): number {
  return reflectionValue(reflection(mtr));
}

function computeRefValue2(mtr: Matrix): number {
  const origRef = reflection(mtr);

  for (let i = 0; i < mtr.length; i++) {
    for (let j = 0; j < mtr[i]!.length; j++) {
      const c = mtr[i]![j]!;
      mtr[i]![j] = c === 1 ? 0 : 1;
      const newRef = reflection(mtr, origRef);
      mtr[i]![j] = c;

      if (newRef.col === undefined && newRef.row === undefined) {
        continue;
      }

      if (newRef.col === origRef.col && newRef.row === origRef.row) {
        continue;
      }

      return reflectionValue(newRef);
    }
  }

  return 0;
}

function symmetryPoint(arr: number[]): number[] {
  const res: number[] = [];

  for (let i = 0; i < arr.length - 1; i++) {
    let j = 0;
    let flag = true;
    let bound = true;

    while (flag && bound) {
      const lo = i - j;
      const hi = i + j + 1;

      if (lo < 0 || hi >= arr.length) {
        bound = false;
      } else if (arr[lo]! !== arr[hi]!) {
        flag = false;
      }

      j++;
    }

    if (!bound) {
      res.push(i);
    }
  }

  return res;
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

export const expected2 = 36771;
export function solve2(lines: string[]): number {
  const input = parseInput(lines);
  let sum = 0;

  for (const mtr of input) {
    sum += computeRefValue2(mtr);
  }

  return sum;
}
