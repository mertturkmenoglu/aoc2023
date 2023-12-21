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

  constructor(lines: string[]) {
    super(lines);
    this.grid = this.parseInput();
  }

  parseInput(): Grid<string> {
    return new Grid<string>(this.lines.map((line) => line.split('')));
  }

  compute(): number {
    const start = this.grid.getPosOfValue('S');

    if (start === null) {
      throw new Error('Cannot find starting position');
    }

    const mapping = [...hvAdjMap]; // Horizontal and vertical

    const queue: Array<[Pos, steps: number]> = [[start, this.targetSteps]];
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

  @Expect(0)
  override solve1(): string | number {
    return this.compute();
  }

  @Expect(0)
  override solve2(): string | number {
    return 0;
  }
}
