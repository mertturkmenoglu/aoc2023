type Pos = [number, number];
type Path = Pos[];

let visited = new Map<string, boolean>();
let pathMap: Map<string, boolean> | null = null;
const gPaths: Path[] = [];
let gMtr: string[][] | null = null;

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
  if (gMtr) {
    return gMtr;
  }
  gMtr = lines.map(line => line.split(""));
  return gMtr;
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

function posKey(pos: Pos): string {
  return `${pos[0]},${pos[1]}`;
}

function getSurroundings(mtr: string[][], pos: Pos): Pos[] {
  const res: Pos[] = [];
  const curr = mtr[pos[0]]![pos[1]]!;

  const surr: [string | undefined, Pos, string[], string[]][] = [
    [ mtr[pos[0] - 1]?.[pos[1]], [pos[0] - 1, pos[1]], toNorth, northChars ],
    [ mtr[pos[0]]![pos[1] - 1] , [pos[0], pos[1] - 1], toWest , westChars  ],
    [ mtr[pos[0] + 1]?.[pos[1]], [pos[0] + 1, pos[1]], toSouth, southChars ],
    [ mtr[pos[0]]![pos[1] + 1] , [pos[0], pos[1] + 1], toEast , eastChars  ],
  ];

  surr.forEach(([el, pos, toChars, chars]) => {
    if (isPipeChar(el) && toChars.includes(curr) && chars.includes(el) && !visited.has(posKey(pos))) {
      visited.set(posKey(pos), true);
      res.push(pos);
    }
  });

  return res;
}

function charAt(mtr: string[][], pos: Pos): string {
  return mtr[pos[0]]![pos[1]]!;
}

function findPaths(mtr: string[][]): Path[] {
  if (gPaths.length !== 0) {
    return gPaths;
  }

  const startPos = getStartPosition(mtr);
  visited.set(posKey(startPos), true);
  const surr = getSurroundings(mtr, startPos);

  for (const p of surr) {
    const path: Path = [p];
    let flag = true;
    let newPos = p;
    visited.set(posKey(p), true);

    while (flag) {
      const surroundings = getSurroundings(mtr, newPos);
      const filtered = surroundings.filter(x => charAt(mtr, x) !== "S");
      if (filtered.length === 0) {
        break;
      } 
    
      newPos = filtered[0]!;
      if (mtr[newPos[0]]![newPos[1]]! === "S") {
        break;
      }

      path.push(newPos);
      visited.set(posKey(newPos), true);
  }

    gPaths.push(path);
    visited.clear();
  }

  return gPaths;
}

function getPathsFromInput(lines: string[]): Path[] {
  return findPaths(parseInput(lines));
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
        const isRegionChange = (ch === "J" && last === "F") || (ch === "7" && last === "L");
        const isRegionStart = ch === "F" || ch === "L";
        if (ch === "|") {
          inRegion = !inRegion;
        } else if (isRegionChange) {
          last = null;
          inRegion = !inRegion;
        } else if (isRegionStart) {
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
  if (!pathMap) {
    pathMap = new Map<string, boolean>();
    for (const p of path) {
      pathMap.set(posKey(p), true);
    }
  }

  return pathMap.get(posKey(pos)) ?? false;
}

export const expected1 = 6942;
export function solve1(lines: string[]): number {
  const paths = getPathsFromInput(lines);
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
