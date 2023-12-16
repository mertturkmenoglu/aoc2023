import 'reflect-metadata';

import { getDayFromArgs } from '../lib/cli';
import { measure } from '../lib/perf';
import { type AbstractSolution } from '../lib/types';
import { DecoratorKeys } from '../lib/dec';

function formatTime(t: number): string {
  return `${t.toFixed(4)} milliseconds`;
}

export async function main(): Promise<void> {
  const { S, lines, num } = await getDayFromArgs();
  const s: AbstractSolution = new S(lines);
  const solutions = [
    { fn: () => s.solve1(), key: 'solve1' },
    { fn: () => s.solve2(), key: 'solve2' },
  ].map(({ fn, key }) => {
    const [result, time] = measure(() => fn());
    const expected = Reflect.getMetadata(DecoratorKeys.EXPECT, s, key);
    return {
      result,
      expected,
      time: formatTime(time),
      correct: result === expected,
    };
  });

  console.log(`Day ${num}`);
  console.table(solutions);
}

void main();
