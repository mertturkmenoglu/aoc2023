import fs from 'node:fs';

type Race = {
  time: number;
  distance: number;
};

type TInput = {
  races: Race[];
};

function parseInput(lines: string[]): TInput {
  const [_a, timeNumbersStr] = lines[0]!.split(':').map(x => x.trim());
  const [_b, distanceNumbersStr] = lines[1]!.split(":").map(x => x.trim());
  const races = [];

  const timeNumbers = timeNumbersStr!.split(' ').map(x => x.trim()).filter(x => x !== '');
  const distanceNumbers = distanceNumbersStr!.split(' ').map(x => x.trim()).filter(x => x !== '');

  for (let i = 0; i < timeNumbers.length; i++) {
    races.push({
      time: +timeNumbers[i]!,
      distance: +distanceNumbers[i]!,
    });
  }

  return {
    races,
  };
}

function parseInput2(lines: string[]): TInput {
  const [_a, timeNumbersStr] = lines[0]!.split(':').map(x => x.trim());
  const [_b, distanceNumbersStr] = lines[1]!.split(":").map(x => x.trim());
  const timeNumber = timeNumbersStr!.split(' ').map(x => x.trim()).filter(x => x !== '').join('');
  const distanceNumber = distanceNumbersStr!.split(' ').map(x => x.trim()).filter(x => x !== '').join('');

  return {
    races: [
      {
        time: +timeNumber,
        distance: +distanceNumber,
      },
    ],
  };
}

function waysOfRace(race: Race): number {
  let counter = 0;

  for (let i = 0; i <= race.time; i++) {
    const speed = i;
    const leftTime = race.time - i;
    const totalDist = speed * leftTime;
    if (totalDist > race.distance) {
      counter++;
    }
  }

  return counter;
}

function solve1(lines: string[]): number {
  const { races } = parseInput(lines);
  let prod = 1;

  for (const race of races) {
    const ways = waysOfRace(race);
    prod *= ways;
  }

  return prod;
}

function solve2(lines: string[]): number {
  const { races } = parseInput2(lines);
  console.log(races)
  return waysOfRace(races[0]!);
}

export function day6() {
  const lines = fs.readFileSync('src/input6.txt').toString().split('\n');
  const res = [solve1(lines), solve2(lines)];
  console.log(`Day 6 result 1: ${res[0]}`);
  console.log(`Day 6 result 2: ${res[1]}`);
}
