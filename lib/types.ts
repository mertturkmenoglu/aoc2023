export abstract class AbstractSolution {
  constructor(protected readonly lines: string[]) {}

  abstract solve1(): number | string;

  abstract solve2(): number | string;
}
