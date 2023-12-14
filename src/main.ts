import { assert } from 'node:console';
import { getDayFromArgs } from './cli';

async function main(): Promise<void> {
  const { module, lines, num } = await getDayFromArgs();
  const start = performance.now();
  const res1 = module.solve1(lines);
  const mid = performance.now();
  const res2 = module.solve2(lines);
  const end = performance.now();
  const exp1 = module.expected1;
  const exp2 = module.expected2;

  const sol1Time = mid - start;
  const sol2Time = end - mid;

  console.log(`Day ${num} result 1: ${res1} | Time: ${sol1Time} milliseconds`);
  console.log(`Day ${num} result 2: ${res2} | Time: ${sol2Time} milliseconds`);
  assert(exp1 === res1, 'part 1 failed');
  assert(exp2 === res2, 'part 2 failed');
}

void main();
