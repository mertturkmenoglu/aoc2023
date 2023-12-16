type Grid = string[][];

type Pos = [number, number];

type PosStr = string;

type Dir = 'U' | 'L' | 'D' | 'R';

interface Beam {
  pos: Pos;
  dir: Dir;
}

function parseInput(lines: string[]): Grid {
  return lines.map((line) => line.split(''));
}

function inGrid(grid: Grid, [row, col]: Pos): boolean {
  if (row < 0 || row >= grid.length) {
    return false;
  }

  if (col < 0 || col >= grid[0]!.length) {
    return false;
  }

  return true;
}

function advanceEmptySpace(pos: Pos, dir: Dir): Pos {
  let newRow = pos[0];
  let newCol = pos[1];
  if (dir === 'L' || dir === 'R') {
    newCol += dir === 'L' ? -1 : 1;
  }

  if (dir === 'U' || dir === 'D') {
    newRow += dir === 'D' ? 1 : -1;
  }

  return [newRow, newCol];
}

function advanceBackMirror([row, col]: Pos, dir: Dir): [Pos, Dir] {
  if (dir === 'R') {
    return [[row + 1, col], 'D'];
  }

  if (dir === 'L') {
    return [[row - 1, col], 'U'];
  }

  if (dir === 'D') {
    return [[row, col + 1], 'R'];
  }

  if (dir === 'U') {
    return [[row, col - 1], 'L'];
  }

  throw new Error('Unreachable');
}

function advanceForwardMirror([row, col]: Pos, dir: Dir): [Pos, Dir] {
  if (dir === 'R') {
    return [[row - 1, col], 'U'];
  }

  if (dir === 'L') {
    return [[row + 1, col], 'D'];
  }

  if (dir === 'D') {
    return [[row, col - 1], 'L'];
  }

  if (dir === 'U') {
    return [[row, col + 1], 'R'];
  }

  throw new Error('Unreachable');
}

function advanceVertSplitter(
  [row, col]: Pos,
  dir: Dir,
): [Pos, Dir, Beam | null] {
  if (dir === 'U') {
    return [[row - 1, col], dir, null];
  }

  if (dir === 'D') {
    return [[row + 1, col], dir, null];
  }

  return [[row - 1, col], 'U', { pos: [row + 1, col], dir: 'D' }];
}

function advanceHorSplitter(
  [row, col]: Pos,
  dir: Dir,
): [Pos, Dir, Beam | null] {
  if (dir === 'L') {
    return [[row, col - 1], dir, null];
  }

  if (dir === 'R') {
    return [[row, col + 1], dir, null];
  }

  return [[row, col - 1], 'L', { pos: [row, col + 1], dir: 'R' }];
}

function countEnergizedCells(grid: Grid, startBeam: Beam): number {
  const energizedCells = new Map<PosStr, boolean>();
  const prev = new Map<string, boolean>();
  const beams: Beam[] = [startBeam];

  while (beams.length > 0) {
    const beam = beams.pop()!;
    let pos = beam.pos;
    let dir = beam.dir;

    while (inGrid(grid, pos)) {
      energizedCells.set(JSON.stringify(pos), true);
      const curr = grid[pos[0]]![pos[1]]!;
      const b = JSON.stringify({ pos, dir });

      if (prev.has(b)) {
        break;
      } else {
        prev.set(b, true);
      }

      if (curr === '.') {
        pos = advanceEmptySpace(pos, dir);
      } else if (curr === '\\') {
        const [newPos, newDir] = advanceBackMirror(pos, dir);
        pos = newPos;
        dir = newDir;
      } else if (curr === '/') {
        const [newPos, newDir] = advanceForwardMirror(pos, dir);
        pos = newPos;
        dir = newDir;
      } else if (curr === '|') {
        const [newPos, newDir, newBeam] = advanceVertSplitter(pos, dir);
        pos = newPos;
        dir = newDir;
        if (newBeam !== null) {
          beams.push(newBeam);
        }
      } else if (curr === '-') {
        const [newPos, newDir, newBeam] = advanceHorSplitter(pos, dir);
        pos = newPos;
        dir = newDir;
        if (newBeam !== null) {
          beams.push(newBeam);
        }
      }
    }
  }

  return energizedCells.size;
}

export const expected1 = 7496;
export function solve1(lines: string[]): number {
  const grid = parseInput(lines);
  const beam: Beam = { pos: [0, 0], dir: 'R' };
  return countEnergizedCells(grid, beam);
}

export const expected2 = 7932;
export function solve2(lines: string[]): number {
  const grid = parseInput(lines);
  const beams: Beam[] = [];

  for (let row = 0; row < grid.length; row++) {
    beams.push({ pos: [row, 0], dir: 'R' });
    beams.push({ pos: [row, grid[row]!.length - 1], dir: 'L' });
  }

  for (let col = 0; col < grid[0]!.length; col++) {
    beams.push({ pos: [0, col], dir: 'D' });
    beams.push({ pos: [0, grid.length - 1], dir: 'U' });
  }

  return Math.max(...beams.map((b) => countEnergizedCells(grid, b)));
}
