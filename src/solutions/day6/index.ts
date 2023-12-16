import { Expect, AbstractSolution } from '../../../lib';

interface Race {
  time: number;
  distance: number;
}

type TInput = Race[];

export class Solution extends AbstractSolution {
  parseTimeAndDistance(): [string[], string[]] {
    const [t, d] = this.lines.map((l) =>
      l
        .split(':')
        .map((x) => x.trim())[1]!
        .split(' ')
        .map((x) => x.trim())
        .filter((x) => x !== ''),
    );
    return [t!, d!];
  }

  parseInput(): TInput {
    const [times, distances] = this.parseTimeAndDistance();
    return new Array(times.length).fill(0).map((_, i) => ({
      time: +times[i]!,
      distance: +distances[i]!,
    }));
  }

  parseInput2(): TInput {
    const [time, distance] = this.parseTimeAndDistance().map((x) => x.join(''));
    return [{ time: +time!, distance: +distance! }];
  }

  winningCount(race: Race): number {
    let counter = 0;

    for (let i = 0; i <= race.time; i++) {
      if (i * (race.time - i) > race.distance) {
        counter++;
      }
    }

    return counter;
  }

  @Expect(440_000)
  override solve1(): string | number {
    return this.parseInput().reduce(
      (acc, race) => acc * this.winningCount(race),
      1,
    );
  }

  @Expect(26_187_338)
  override solve2(): string | number {
    return this.winningCount(this.parseInput2()[0]!);
  }
}
