import { assert } from 'node:console';
import fs from 'node:fs';

type TMap = {
  dst: number;
  src: number;
  length: number;
};

type TInput = {
  seeds: number[];
  mappings: TMap[][];
}

function parseInput(lines: string[]): TInput {
  const sections: string[][] = [];
  const tmp: string[] = [];

  for (const line of lines) {
    if (line.trim() !== '') {
      tmp.push(line);
    } else {
      sections.push([...tmp]);
      tmp.length = 0
    }
  }

  sections.push([...tmp]);

  return {
    seeds: sections[0]![0]!.split(': ')[1]!.split(' ').map((s) => +s),
    mappings: sections.slice(1).map((m) => {
      return m.slice(1).map((s) => {
        const [dst, src, l] = s.split(' ');
        return { dst: +dst!, src: +src!, length: +l!, };
      });
    }),
  };
}

function getMap(x: number, maps: TMap[]): TMap | undefined {
  return maps.find((m) => x >= m.src && x <= m.src + m.length - 1);
}

function getTarget(x: number, maps: TMap[]): number {
  const map = getMap(x, maps);
  return map ? map.dst + (x - map.src) : x;
}

let lastResult: number | null = null;
let lastMap: TMap | undefined = undefined;

function seedToLocation(seed: number, mappings: TMap[][]): number {
  const map = getMap(seed, mappings[0]!);
  if (map?.src === lastMap?.src && lastResult) {
    return lastResult + 1;
  }

  const result = mappings.reduce((acc, m) => getTarget(acc, m), seed);
  lastResult = result;
  lastMap = map;
  return result;
}

function solve1(lines: string[]): number {
  const { seeds, mappings } = parseInput(lines);
  return Math.min(...seeds.map((seed) => seedToLocation(seed, mappings)));
}

function solve2(lines: string[]): number {
  const { seeds, mappings } = parseInput(lines);
  let min = -1;
  const ranges: [number, number][] = [];

  for (let i = 0; i < seeds.length; i += 2) {
    ranges.push([seeds[i]!, seeds[i + 1]!])
  }

  for (const [start, len] of ranges) {
    let seed = start;
    while (seed < start + len) {
      const map = getMap(seed, mappings[0]!);
      const loc = seedToLocation(seed, mappings);
      min = min === -1 || loc < min ? loc : min;
      seed = map ? map.src + map.length : seed + len;
    }
  }

  return min;
}

export function day5() {
  const lines = fs.readFileSync('src/input5.txt').toString().split('\n');
  const res = [solve1(lines), solve2(lines)];
  console.log(`Day 5 result 1: ${res[0]}`);
  console.log(`Day 5 result 2: ${res[1]}`);
  assert(res[0] === 322500873, 'part 1');
  assert(res[1] === 108956227, 'part 2');
}
