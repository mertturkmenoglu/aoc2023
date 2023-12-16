import { Expect } from '../../../lib/dec';
import { AbstractSolution } from '../../../lib/types';

type Row = [springs: string, groups: number[]];

function parseInput(lines: string[], sol: number): Row[] {
  return lines.map((line) => {
    const [charsSec, groupsSec] = line.split(' ');
    const chars: string[] = [];
    const groups: string[] = [];

    for (let i = 0; i < (sol === 1 ? 1 : 5); i++) {
      chars.push(charsSec!);
      groups.push(groupsSec!);
    }

    return [chars.join('?'), groups.join(',').split(',').map(Number)];
  });
}

function key(row: Row): string {
  return `${row[0]}|${row[1].join()}`;
}

const cache = new Map<string, number>();

function count(row: Row): number {
  const [config, groups] = row;

  if (groups.length === 0) {
    return config.includes('#') ? 0 : 1;
  }

  if (config.length === 0) {
    return 0;
  }

  if (cache.has(key(row))) {
    return cache.get(key(row))!;
  }

  let result = 0;
  const ch = config[0]!;
  const n = groups[0]!;

  if ('.?'.includes(ch)) {
    result += count([config.slice(1), groups]);
  }

  if (
    '#?'.includes(ch) &&
    n <= config.length &&
    !config.slice(0, n).includes('.') &&
    (n === config.length || config[n] !== '#')
  ) {
    result += count([config.slice(n + 1), groups.slice(1)]);
  }

  cache.set(key(row), result);
  return result;
}

export class Solution extends AbstractSolution {
  @Expect(8022)
  override solve1(): string | number {
    return parseInput(this.lines, 1)
      .map(count)
      .reduce((acc, x) => acc + x, 0);
  }

  @Expect(4_968_620_679_637)
  override solve2(): string | number {
    return parseInput(this.lines, 2)
      .map(count)
      .reduce((acc, x) => acc + x, 0);
  }
}
