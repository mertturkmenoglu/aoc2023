import fs from 'node:fs';

export function readLines(path: string): string[] {
  return fs.readFileSync(path).toString().split('\n');
}

export function doesDayExist(day: number): boolean {
  return fs.existsSync(`src/solutions/day${day}`);
}

export function createDirAndContents(day: number): void {
  const path = `src/solutions/day${day}`;
  fs.mkdirSync(path);
  fs.writeFileSync(`${path}/index.ts`, template);
  fs.writeFileSync(`${path}/input.txt`, '');
}

const template = `import { Expect, AbstractSolution } from '../../../lib';

export class Solution extends AbstractSolution {
  @Expect(0)
  override solve1(): string | number {
    return 0;
  }

  @Expect(0)
  override solve2(): string | number {
    return 0;
  }
}
`;
