import PriorityQueue from 'priorityqueuejs';
import { Expect, AbstractSolution, type Grid } from '../../../lib';

type El = [
  heatLoss: number,
  row: number,
  col: number,
  dr: number,
  dc: number,
  n: number,
];

// class PriorityQueue<T> {
//   constructor(
//     private readonly queue: Array<{ el: T; priority: number }> = [],
//     private readonly by: (el: T) => number,
//   ) {}

//   add(n: T): void {
//     this.queue.push({ el: n, priority: this.by(n) });
//     this.queue.sort((a, b) => a.priority - b.priority);
//   }

//   poll(): T | undefined {
//     return this.queue.shift()?.el;
//   }

//   isEmpty(): boolean {
//     return this.queue.length === 0;
//   }

//   elements(): T[] {
//     return this.queue.map((el) => el.el);
//   }
// }

export class Solution extends AbstractSolution {
  private readonly grid: Grid<number>;

  constructor(lines: string[]) {
    super(lines);
    this.grid = this.parseGrid();
  }

  private parseGrid(): Grid<number> {
    return this.lines.map((line) => line.split('').map((x) => +x));
  }

  dijkstra(): number {
    const seen = new Map<string, boolean>();
    const pq = new PriorityQueue<El>(function (a, b) {
      return b[0] - a[0];
    });

    pq.enq([0, 0, 0, 0, 0, 0]);

    while (!pq.isEmpty()) {
      const [hl, r, c, dr, dc, n] = pq.deq()!;

      if (r === this.grid.length - 1 && c === this.grid[0]!.length - 1) {
        return hl;
      }

      const s = JSON.stringify([r, c, dr, dc, n]);

      if (seen.has(s)) {
        continue;
      }

      seen.set(s, true);

      if (n < 3 && !(dr === 0 && dc === 0)) {
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

  dijkstra2(): number {
    const seen = new Map<string, boolean>();
    const pq = new PriorityQueue<El>(function (a, b) {
      return b[0] - a[0];
    });

    pq.enq([0, 0, 0, 0, 0, 0]);

    while (!pq.isEmpty()) {
      const [hl, r, c, dr, dc, n] = pq.deq();

      if (
        r === this.grid.length - 1 &&
        c === this.grid[0]!.length - 1 &&
        n >= 4
      ) {
        return hl;
      }

      const s = JSON.stringify([r, c, dr, dc, n]);

      if (seen.has(s)) {
        continue;
      }

      seen.set(s, true);

      if (n < 10 && !(dr === 0 && dc === 0)) {
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

      if (n >= 4 || (dr === 0 && dc === 0)) {
        for (const [ndr, ndc] of [
          [0, 1],
          [1, 0],
          [0, -1],
          [-1, 0],
        ]) {
          if (!(ndr === dr && ndc === dc) && !(ndr === -dr && ndc === -dc)) {
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
    }

    return -1;
  }

  @Expect(722)
  override solve1(): string | number {
    return this.dijkstra();
  }

  @Expect(894)
  override solve2(): string | number {
    return this.dijkstra2();
  }
}
