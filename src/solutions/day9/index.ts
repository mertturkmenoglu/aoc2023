import { Expect } from '../../../lib/dec';
import { AbstractSolution } from '../../../lib/types';

const parseInput = (lines: string[]): number[][] =>
  lines.map((line) => line.split(' ').map(Number));

const diff = (arr: number[]): number[] =>
  new Array(arr.length)
    .fill(0)
    .map((_, i) => i)
    .slice(1)
    .map((i) => arr[i]! - arr[i - 1]!);

function diffs(history: number[], type: 'next' | 'prev'): number[] {
  const i = type === 'next' ? -1 : 0;
  const list = [history.at(i)!];
  let tmp = diff(history);

  while (!tmp.every((x) => x === 0)) {
    list.push(tmp.at(i)!);
    tmp = diff(tmp);
  }

  return list;
}

const nextValue = (history: number[]): number =>
  diffs(history, 'next').reduce((acc, x) => acc + x, 0);

function prevValue(history: number[]): number {
  const list = diffs(history, 'prev');
  return new Array(list.length)
    .fill(0)
    .map((_, i, arr) => arr.length - i - 1)
    .reduce((acc, i) => list[i]! - acc, 0);
}

export class Solution extends AbstractSolution {
  @Expect(1_995_001_648)
  override solve1(): string | number {
    return parseInput(this.lines).reduce((acc, x) => acc + nextValue(x), 0);
  }

  @Expect(988)
  override solve2(): string | number {
    return parseInput(this.lines).reduce((acc, x) => acc + prevValue(x), 0);
  }
}
