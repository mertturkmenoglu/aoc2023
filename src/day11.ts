type Pos = [number, number];

function parseInput(lines: string[]): string[][] {
  return lines.map((line) => line.split(''));
}

function expandSpace(space: string[][]): string[][] {
  const newSpace = [...space];
  let i = 0;

  // Insert row
  while (i < newSpace.length) {
    if (newSpace[i]!.every((x) => x === ".")) {
      newSpace.splice(i, 0, new Array(newSpace[i]!.length).fill('.'));
      i += 2;
    } else {
      i++;
    }
  }

  i = 0;

  // Insert column
  while (i < newSpace[0]!.length) {
    const col = newSpace.map((row) => row[i]!);

    if (col.every((x) => x === ".")) {
      for (let row = 0; row < newSpace.length; row++) {
        newSpace[row]!.splice(i, 0, ".");
      }
      i += 2;
    } else {
      i++;
    }
  }

  return newSpace;
}

function assignIdToGalaxies(space: string[][]) {
  let id = 1;

  for (let i = 0; i < space.length; i++) {
    for (let j = 0; j < space[i]!.length; j++) {
      if (space[i]![j]! === "#") {
        space[i]![j]! = id.toString();
        id++;
      }
    }
  }
}

function dist(posA: Pos, posB: Pos): number {
  const dy = Math.abs(posA[0] - posB[0]);
  const dx = Math.abs(posA[1] - posB[1]);
  return dy + dx;
}

function distanceSum(space: string[][]): number {
  const galaxies = getGalaxies(space);
  let sum = 0;

  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const [, posA] = galaxies[i]!;
      const [, posB] = galaxies[j]!;

      const d = dist(posA, posB);
      sum += d;
    }
  }

  return sum;
}

function getGalaxies(space: string[][]): [number, Pos][] {
  const galaxies: [number, Pos][] = [];

  for (let i = 0; i < space.length; i++) {
    for (let j = 0; j < space[i]!.length; j++) {
      const ch = space[i]![j]!;
      if (ch !== '.') {
        galaxies.push([+ch, [i, j]]);
      }
    }
  }

  return galaxies;
}

export const expected1 = 0;
export function solve1(lines: string[]): number {
  const space = parseInput(lines);
  const expandedSpace = expandSpace(space);
  assignIdToGalaxies(expandedSpace);
  return distanceSum(expandedSpace);
}

export const expected2 = 0;
export function solve2(lines: string[]): number {
  return lines.length;
}
