import {
  Expect,
  AbstractSolution,
  isNumberString,
  type TGrid,
  type Pos,
  adjMap,
} from '../../../lib';

type Dir = 'R' | 'L' | 'U' | 'D';

interface Ins {
  dir: Dir;
  len: number;
  color: string;
}

export class Solution extends AbstractSolution {
  private readonly instructions: Ins[];
  private readonly grid: TGrid<string>;
  private readonly rowCount = 1000;
  private readonly colCount = 1000;
  private readonly startRow = this.rowCount / 2;
  private readonly startCol = this.colCount / 5;

  constructor(lines: string[]) {
    super(lines);
    this.instructions = this.parseInput();
    this.grid = new Array(this.rowCount).fill(0).map(() => {
      return new Array(this.colCount).fill('.');
    });
  }

  parseInput(): Ins[] {
    return this.lines.map((line, i) => {
      const [dirstr, lenstr, colorstr] = line.split(' ');

      if (
        !(dirstr === 'R' || dirstr === 'L' || dirstr === 'U' || dirstr === 'D')
      ) {
        throw new Error('Invalid format dir');
      }

      if (lenstr === undefined || !isNumberString(lenstr)) {
        throw new Error(`Invalid format len ${lenstr} ${i}`);
      }

      if (colorstr === undefined) {
        throw new Error('Invalid format color');
      }

      return {
        color: colorstr,
        dir: dirstr,
        len: +lenstr,
      };
    });
  }

  parseInput2(): Ins[] {
    return this.lines.map((line) => {
      const [, , colorstr] = line.split(' ');
      const color = colorstr!.substring(2, colorstr!.length - 1);
      const hexLen = color.substring(0, color.length - 1);
      const hexIns = color[color.length - 1]!;
      let dir: Dir = 'R';

      if (hexIns === '0') {
        dir = 'R';
      } else if (hexIns === '1') {
        dir = 'D';
      } else if (hexIns === '2') {
        dir = 'L';
      } else {
        dir = 'U';
      }

      return {
        color,
        dir,
        len: parseInt(hexLen, 16),
      };
    });
  }

  executeInstructions(): void {
    let row = this.startRow;
    let col = this.startCol;

    this.grid[row]![col] = '#';

    for (const { dir, len } of this.instructions) {
      if (dir === 'U' || dir === 'D') {
        for (let i = 0; i < len; i++) {
          row = dir === 'U' ? row - 1 : row + 1;
          this.grid[row]![col] = '#';
        }
      } else {
        for (let i = 0; i < len; i++) {
          col = dir === 'R' ? col + 1 : col - 1;
          this.grid[row]![col] = '#';
        }
      }
    }
  }

  fill(): void {
    const stack: Pos[] = [[this.startRow - 1, this.startCol - 1]];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const [r, c] = stack.pop()!;

      for (const [dr, dc] of adjMap) {
        const p: Pos = [r + dr, c + dc];
        if (this.grid[p[0]]![p[1]] !== '#' && !visited.has(JSON.stringify(p))) {
          stack.push(p);
        }
      }

      this.grid[r]![c] = 'I';
      visited.add(JSON.stringify([r, c]));
    }
  }

  count(): number {
    let counter = 0;
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i]!.length; j++) {
        const ch = this.grid[i]![j];
        if (ch === '#' || ch === 'I') {
          counter++;
        }
      }
    }

    return counter;
  }

  // Solve using iteration and BFS
  @Expect(67_891)
  override solve1(): string | number {
    this.executeInstructions();
    this.fill();
    return this.count();
  }

  @Expect(94_116_351_948_493)
  override solve2(): string | number {
    const instructions = this.parseInput2();
    const points: Pos[] = [[0, 0]];
    const dirs: Record<Dir, Pos> = {
      U: [-1, 0],
      D: [1, 0],
      L: [0, -1],
      R: [0, 1],
    };

    let counter = 0;

    for (const ins of instructions) {
      const [dr, dc] = dirs[ins.dir];
      counter += ins.len;
      const [r, c] = points.at(-1)!;
      points.push([r + dr * ins.len, c + dc * ins.len]);
    }

    // Shoelace formula + Pick's theorem

    let sum = 0;

    for (let i = 0; i < points.length; i++) {
      const xi = points[i]![0]!;
      const yprev = points.at(i - 1)![1];
      const ynext = points[(i + 1) % points.length]![1];
      sum += xi * (yprev - ynext);
    }

    const A = Math.abs(sum) / 2;
    const i = A - counter / 2 + 1;
    return i + counter;
  }
}
