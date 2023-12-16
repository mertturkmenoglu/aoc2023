import { Expect } from '../../../lib/dec';
import { AbstractSolution } from '../../../lib/types';

type Pos = [row: number, col: number];
type Expansion = [row: number, col: number];
type Galaxy = [Pos, Expansion];

function parseUniverse(lines: string[]): Galaxy[] {
  const space = lines.map((line) => line.split(''));
  const universe: Galaxy[] = [];
  let emptyRows = 0;

  for (let row = 0; row < space.length; row++) {
    const isEmptyRow = space[row]!.every((ch) => ch !== '#');
    let emptyCols = 0;

    if (isEmptyRow) {
      emptyRows++;
    }

    for (let col = 0; col < space[row]!.length; col++) {
      const isEmptyCol = space
        .map((row) => row[col]!)
        .every((ch) => ch !== '#');

      if (isEmptyCol) {
        emptyCols++;
      }

      if (space[row]![col]! === '#') {
        universe.push([
          [row, col],
          [emptyRows, emptyCols],
        ]);
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

function distanceSum(lines: string[], sol: number): number {
  const rate = sol === 1 ? 1 : 1_000_000 - 1;
  const galaxies = parseUniverse(lines);
  let sum = 0;

  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const a = galaxies[i]!;
      const b = galaxies[j]!;
      sum += dist(a, b, rate);
    }
  }

  return sum;
}

export class Solution extends AbstractSolution {
  @Expect(10_422_930)
  override solve1(): string | number {
    return distanceSum(this.lines, 1);
  }

  @Expect(699_909_023_130)
  override solve2(): string | number {
    return distanceSum(this.lines, 2);
  }
}
