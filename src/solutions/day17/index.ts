import PriorityQueue from 'priorityqueuejs';
import { Expect, AbstractSolution, type TGrid } from '../../../lib';

type El = [number, number, number, number, number, number];

export class Solution extends AbstractSolution {
  private readonly grid: TGrid<number>;

  constructor(lines: string[]) {
    super(lines);
    this.grid = this.parseGrid();
  }

  private parseGrid(): TGrid<number> {
    return this.lines.map((line) => line.split('').map((x) => +x));
  }

  dijkstra(sol2: boolean): number {
    const seen = new Map<string, boolean>();
    const pq = new PriorityQueue<El>(function (a, b) {
      return b[0] - a[0];
    });

    pq.enq([0, 0, 0, 0, 0, 0]);

    while (!pq.isEmpty()) {
      const [hl, r, c, dr, dc, n] = pq.deq()!;

      if (r === this.grid.length - 1 && c === this.grid[0]!.length - 1) {
        if (sol2 && n >= 4) {
          return hl;
        }
        if (!sol2) {
          return hl;
        }
      }

      const s = JSON.stringify([r, c, dr, dc, n]);

      if (seen.has(s)) {
        continue;
      }

      seen.set(s, true);

      if (n < (sol2 ? 10 : 3) && !(dr === 0 && dc === 0)) {
        const nr = r + dr;
        const nc = c + dc;

        if (
          nr >= 0 &&
          nr < this.grid.length &&
          nc >= 0 &&
          nc < this.grid[0]!.length
        ) {
          pq.enq([hl + this.grid[nr]![nc]!, nr, nc, dr, dc, n + 1]);
        }
      }

      if (sol2) {
        let flag = false;
        if (n >= 4 || (dr === 0 && dc === 0)) {
          flag = true;
        }

        if (!flag) {
          continue;
        }
      }

      for (const [ndr, ndc] of [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ]) {
        const cnd1 = !(ndr === dr && ndc === dc);
        const cnd2 = !(ndr === -dr && ndc === -dc);
        if (cnd1 && cnd2) {
          const nr = r + ndr!;
          const nc = c + ndc!;

          if (
            nr >= 0 &&
            nr < this.grid.length &&
            nc >= 0 &&
            nc < this.grid[0]!.length
          ) {
            pq.enq([hl + this.grid[nr]![nc]!, nr, nc, ndr!, ndc!, 1]);
          }
        }
      }
    }

    return -1;
  }

  @Expect(722)
  override solve1(): string | number {
    return this.dijkstra(false);
  }

  @Expect(894)
  override solve2(): string | number {
    return this.dijkstra(true);
  }
}
