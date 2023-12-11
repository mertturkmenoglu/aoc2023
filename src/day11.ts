type Pos = [row: number, col: number];
type Expansion = [row: number, col: number];
type Galaxy = [Pos, Expansion];

function parseInput(lines: string[]): string[][] {
  return lines.map((line) => line.split(''));
}

function parseUniverse(space: string[][]): Galaxy[] {
  let totalEmptyRows = 0;
  const universe: Galaxy[] = [];

  for (let row = 0; row < space.length; row++) {
    let emptyRow = space[row]!.every(ch => ch !== '#');
    if (emptyRow) {
      totalEmptyRows++;
    }

    let totalEmptyColumns  = 0;

    for (let col = 0; col < space[row]!.length; col++) {
      const emptyCol = space.map(row => row[col]!).every(ch => ch !== '#');

      if (emptyCol) {
        totalEmptyColumns++;
      }

      const ch = space[row]![col]!;

      if (ch === '#') {
        const g: Galaxy = [ [row, col], [totalEmptyRows, totalEmptyColumns] ]
        universe.push(g);
      }
    }
  }

  return universe;
}

function realPosition(g: Galaxy, expRate: number): Pos {
  const [pos, exp] = g;
  return [pos[0] + exp[0] * expRate, pos[1] + exp[1] * expRate];
}

function dist(a: Galaxy, b: Galaxy, rate: number): number {
  const posA = realPosition(a, rate);
  const posB = realPosition(b, rate);

  const dy = Math.abs(posA[0] - posB[0]);
  const dx = Math.abs(posA[1] - posB[1]);
  return dy + dx;
}

function distanceSum(space: string[][], sol: number): number {
  const rate = sol === 1 ? 1 : (1_000_000 - 1);
  const galaxies = parseUniverse(space);

  let sum = 0;

  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const a = galaxies[i]!;
      const b = galaxies[j]!;

      const d = dist(a, b, rate);
      sum += d;
    }
  }

  return sum;
}

export const expected1 = 10422930;
export function solve1(lines: string[]): number {
  const space = parseInput(lines);
  return distanceSum(space, 1);
}

export const expected2 = 699909023130;
export function solve2(lines: string[]): number {
  const space = parseInput(lines);
  return distanceSum(space, 2);
}
