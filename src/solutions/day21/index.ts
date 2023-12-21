import {
  Expect,
  AbstractSolution,
  Grid,
  hvAdjMap,
  type Pos,
} from '../../../lib';

export class Solution extends AbstractSolution {
  private readonly grid: Grid<string>;
  private readonly targetSteps = 64;
  private readonly actualTarget = 26_501_365;

  constructor(lines: string[]) {
    super(lines);
    this.grid = this.parseInput();
  }

  parseInput(): Grid<string> {
    return new Grid<string>(this.lines.map((line) => line.split('')));
  }

  compute(start: Pos, target: number): number {
    const mapping = [...hvAdjMap]; // Horizontal and vertical
    const queue: Array<[Pos, steps: number]> = [[start, target]];
    const visited = new Set<string>();
    const result = new Set<string>();
    const s = JSON.stringify;

    while (queue.length > 0) {
      const [[r, c], steps] = queue.shift()!;

      if (steps % 2 === 0) {
        result.add(s([r, c]));
      }

      if (steps === 0) {
        continue;
      }

      for (const [dr, dc] of mapping) {
        const newPos: Pos = [r + dr, c + dc];
        if (
          this.grid.isPosInGrid(newPos) &&
          this.grid.atPos(newPos) !== '#' &&
          !visited.has(s(newPos))
        ) {
          visited.add(s(newPos));
          queue.push([newPos, steps - 1]);
        }
      }
    }

    return result.size;
  }

  @Expect(3532)
  override solve1(): string | number {
    const start = this.grid.getPosOfValue('S');

    if (start === null) {
      throw new Error('Cannot find starting position');
    }

    return this.compute(start, this.targetSteps);
  }

  @Expect(590_104_708_070_703)
  override solve2(): string | number {
    const start = this.grid.getPosOfValue('S');

    if (start === null) {
      throw new Error('Cannot find starting position');
    }

    const [r, c] = this.grid.dims();

    if (r !== c) {
      throw new Error('Grid has to be a square');
    }

    const middleCheck = start[0] === start[1] && start[0] === Math.floor(r / 2);

    if (!middleCheck) {
      throw new Error('Starting point has to be in the middle of the grid');
    }

    const stepsCheck = this.actualTarget % r === Math.floor(r / 2);

    if (!stepsCheck) {
      throw new Error('Invalid');
    }

    const f = Math.floor;

    const gridWidth = f(this.actualTarget / r) - 1;
    const odd = Math.pow(f(gridWidth / 2) * 2 + 1, 2);
    const even = Math.pow(f((gridWidth + 1) / 2) * 2, 2);
    const oddPoints = this.compute(start, r * 2 + 1);
    const evenPoints = this.compute(start, r * 2);
    const ct = this.compute([r - 1, start[1]], r - 1);
    const cr = this.compute([start[0], 0], r - 1);
    const cb = this.compute([0, start[1]], r - 1);
    const cl = this.compute([start[0], r - 1], r - 1);
    const str = this.compute([r - 1, 0], f(r / 2) - 1);
    const stl = this.compute([r - 1, r - 1], f(r / 2) - 1);
    const sbr = this.compute([0, 0], f(r / 2) - 1);
    const sbl = this.compute([0, r - 1], f(r / 2) - 1);
    const ltr = this.compute([r - 1, 0], f((r * 3) / 2) - 1);
    const ltl = this.compute([r - 1, r - 1], f((r * 3) / 2) - 1);
    const lbr = this.compute([0, 0], f((r * 3) / 2) - 1);
    const lbl = this.compute([0, r - 1], f((r * 3) / 2) - 1);

    return (
      odd * oddPoints +
      even * evenPoints +
      ct +
      cr +
      cb +
      cl +
      (gridWidth + 1) * (str + stl + sbr + sbl) +
      gridWidth * (ltr + ltl + lbr + lbl)
    );
  }
}
