type Pos = [number, number];
type Path = Pos[];

let visited = new Map<string, boolean>();

const pipeChars = ["|", "-", "L", "J", "7", "F", "S"] as const;
type PipeChar = typeof pipeChars[number];

const toNorth = ["|", "L", "J", "S"];
const toWest = ["-", "J", "7", "S"];
const toSouth = ["|", "7", "F", "S"];
const toEast = ["-", "L", "F", "S"];
const northChars = ["|", "7", "F", "S"];
const westChars = ["-", "L", "F", "S"];
const southChars = ["|", "L", "J", "S"];
const eastChars = ["-", "J", "7", "S"];

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

  const x: [string | undefined, Pos, string[], string[]][] = [
    [ mtr[pos[0] - 1]?.[pos[1]], [pos[0] - 1, pos[1]], toNorth, northChars ],
    [ mtr[pos[0]]![pos[1] - 1] , [pos[0], pos[1] - 1], toWest , westChars  ],
    [ mtr[pos[0] + 1]?.[pos[1]], [pos[0] + 1, pos[1]], toSouth, southChars ],
    [ mtr[pos[0]]![pos[1] + 1] , [pos[0], pos[1] + 1], toEast , eastChars  ],
  ];

  x.forEach(([el, p, to, chars]) => {
    if (isPipeChar(el) && to.includes(curr) && chars.includes(el) && !visited.has(pkey(p))) {
      visited.set(pkey(p), true);
      res.push(p);
    }
  });

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

// Scanline algorithm
// https://en.wikipedia.org/wiki/Scanline_rendering
function enclosed(mtr: string[][], path: Path): number {
  let counter = 0;

  for (let i = 0; i < mtr.length; i++) {
    let inRegion = false;
    let last: string | null = null;
    for (let j = 0; j < mtr[i]!.length; j++) {
      const pos: Pos = [i, j];
      
      if (isInPath(path, pos)) {
        const ch = charAt(mtr, pos);
        if (ch === "|") {
          inRegion = !inRegion;
        } else if (ch === "J" && last === "F") {
          last = null;
          inRegion = !inRegion;
        } else if (ch === "7" && last === "L") {
          last = null;
          inRegion = !inRegion;
        } else if (ch === "F" || ch === "L") {
          last = ch;
        }
      } else { 
        if (inRegion) {
          counter++;
        }
      }
    }
  }

  return counter;
}

function isInPath(path: Path, pos: Pos): boolean {
  return path.some((p) => p[0] === pos[0] && p[1] === pos[1]);
}

export const expected1 = 6942;
export function solve1(lines: string[]): number {
  const mtr = parseInput(lines);
  const paths = findPaths(mtr);
  return (Math.max(...paths.map(p => p.length)) + 1) / 2;
}

export const expected2 = 297;
export function solve2(lines: string[]): number {
  const mtr = parseInput(lines);
  const paths = findPaths(mtr);
  paths.sort((a, b) => a.length - b.length);
  const s = getStartPosition(mtr);
  mtr[s[0]]![s[1]]! = "J";
  return enclosed(mtr, [s, ...paths.at(-1)!]);
}
