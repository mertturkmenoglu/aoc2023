import {
  Expect,
  AbstractSolution,
  isNumberString,
  type Grid,
  type Pos,
} from '../../../lib';

interface Ins {
  dir: 'R' | 'L' | 'U' | 'D';
  len: number;
  color: string;
}

export class Solution extends AbstractSolution {
  private readonly instructions: Ins[];
  private readonly grid: Grid<string>;
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
      // console.log('len', stack.length);
      const [r, c] = stack.pop()!;
      const mapping: Pos[] = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];

      for (const [dr, dc] of mapping) {
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

  @Expect(67_891)
  override solve1(): string | number {
    this.executeInstructions();
    this.fill();
    // const a = this.grid.map((x) => x.join('')).join('\n');
    // fs.writeFileSync('mytestfile.txt', a);
    return this.count();
  }

  @Expect(0)
  override solve2(): string | number {
    return 0;
  }
}
