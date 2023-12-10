type Pos = [number, number];
type Path = Pos[];

let visited = new Map<string, boolean>();

const pipeChars = ["|", "-", "L", "J", "7", "F", "S"] as const;
type PipeChar = typeof pipeChars[number];

function isPipeChar(ch: string | undefined): ch is PipeChar {
  return pipeChars.indexOf(ch as PipeChar) !== -1;
}

function parseInput(lines: string[]): string[][] {
  return lines.map(line => line.split(""));
}

function getStartPosition(mtr: string[][]): Pos {
  for (let i = 0; i < mtr.length; i++) {
    for (let j = 0; j < mtr[i]!.length; j++) {
      if (mtr[i]![j]! === "S") {
        return [i, j];
      }
    }
  }

  throw new Error("Cannot find the starting position");
}

function pkey(pos: Pos): string {
  return `${pos[0]},${pos[1]}`;
}

function getSurroundings(mtr: string[][], pos: Pos): Pos[] {
  const res: Pos[] = [];
  const curr = mtr[pos[0]]![pos[1]]!;
  const north = mtr[pos[0] - 1]?.[pos[1]];
  const west = mtr[pos[0]]![pos[1] - 1];
  const south = mtr[pos[0] + 1]?.[pos[1]];
  const east = mtr[pos[0]]![pos[1] + 1];

  if (isPipeChar(north)) {
    const toNorth = ["|",  "L", "J", "S"];
    const continueChars = ["|", "7", "F", "S"];
    const p: Pos = [pos[0] - 1, pos[1]];
    if (toNorth.includes(curr) && continueChars.includes(north) && !visited.has(pkey(p))) {
      visited.set(pkey(p), true);
      res.push(p);
    }
  }

  if (isPipeChar(west)) {
    const toWest = ["-", "J", "7", "S"]
    const continueChars = ["-", "L", "F", "S"];
    const p: Pos = [pos[0], pos[1] - 1];
    if (toWest.includes(curr) && continueChars.includes(west) && !visited.has(pkey(p))) {
      visited.set(pkey(p), true);
      res.push(p);
    }
  }

  if (isPipeChar(south)) {
    const toSouth = ["|", "7", "F", "S"];
    const continueChars = ["|", "L", "J", "S"];
    const p: Pos = [pos[0] + 1, pos[1]];
    if (toSouth.includes(curr) && continueChars.includes(south) && !visited.has(pkey(p))) {
      visited.set(pkey(p), true);
      res.push(p);
    }
  }

  if (isPipeChar(east)) {
    const toEast = ["-", "L", "F", "S"];
    const continueChars = ["-", "J", "7", "S"];
    const p: Pos = [pos[0], pos[1] + 1];
    if (toEast.includes(curr) && continueChars.includes(east) && !visited.has(pkey(p))) {
      visited.set(pkey(p), true);
      res.push(p);
    }
  }

  return res;
}

function charAt(mtr: string[][], pos: Pos): string {
  return mtr[pos[0]]![pos[1]]!;
}

function findPaths(mtr: string[][]): Path[] {
  const paths: Path[] = [];
  const startPos = getStartPosition(mtr);
  visited.set(pkey(startPos), true);
  const surr = getSurroundings(mtr, startPos);

  for (const p of surr) {
    const path: Path = [p];
    let flag = true;
    let newPos = p;
    visited.set(pkey(p), true);

    while (flag) {
      const surroundings = getSurroundings(mtr, newPos);
      if (surroundings.filter(x => charAt(mtr, x) !== "S").length === 0) {
        flag = false;
      } else {
        newPos = surroundings.filter(x => charAt(mtr, x) !== "S")[0]!;
        if (mtr[newPos[0]]![newPos[1]]! === "S") {
          flag = false;
        } else {
          path.push(newPos);
          visited.set(pkey(newPos), true);
        }
      }
    }

    paths.push(path);
    visited.clear();
  }

  return paths;
}

export const expected1 = 0;
export function solve1(lines: string[]): number {
  const mtr = parseInput(lines);
  const paths = findPaths(mtr);
  return (Math.max(...paths.map(p => p.length)) + 1) / 2;
}

export const expected2 = 0;
export function solve2(lines: string[]): number {
  return lines.length;
}
