import { assert } from 'node:console';
import fs from 'node:fs';

type Race = {
  time: number;
  distance: number;
};

type TInput = Race[];

function parseTimeAndDistance(lines: string[]): [string[], string[]] {
  const [t, d] = lines.map((l) => l.split(':').map(x => x.trim())[1]!.split(' ').map(x => x.trim()).filter(x => x !== ''));
  return [t!, d!];
}

function parseInput(lines: string[]): TInput {
  const [times, distances] = parseTimeAndDistance(lines);
  return new Array(times.length).fill(0).map((_, i) => ({
    time: +times[i]!,
    distance: +distances[i]!,
  }));
}

function parseInput2(lines: string[]): TInput {
  const [time, distance] = parseTimeAndDistance(lines).map((x) => x.join(''));
  return [{ time: +time!, distance: +distance! }];
}

function winningCount(race: Race): number {
  let counter = 0;

  for (let i = 0; i <= race.time; i++) {
    if ((i * (race.time - i)) > race.distance) {
      counter++;
    }
  }

  return counter;
}

function solve1(lines: string[]): number {
  const races = parseInput(lines);
  return races.reduce((acc, race) => acc * winningCount(race), 1);
}

function solve2(lines: string[]): number {
  const races = parseInput2(lines);
  return winningCount(races[0]!);
}

export function day6() {
  const lines = fs.readFileSync('src/input6.txt').toString().split('\n');
  const res = [solve1(lines), solve2(lines)];
  console.log(`Day 6 result 1: ${res[0]}`);
  console.log(`Day 6 result 2: ${res[1]}`);
  assert(res[0] === 440000, 'part 1');
  assert(res[1] === 26187338, 'part 2');
}
