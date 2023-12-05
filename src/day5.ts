import { assert } from 'node:console';
import fs from 'node:fs';

type TMap = {
  dst: number;
  src: number;
  length: number;
};

type TInput = {
  seeds: number[],
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
      })
    }),
  };
}

function getTarget(x: number, maps: TMap[]): number {
  const map = maps.find((m) => x >= m.src && x <= m.src + m.length - 1);
  return map ? map.dst + (x - map.src) : x;
}

function solve1(lines: string[]): number {
  const { seeds, mappings } = parseInput(lines);
  let min = -1;

  for (const seed of seeds) {
    let input = seed;
    for (const m of mappings) {
      input = getTarget(input, m);
    }
    if (min === -1 || input < min) {
      min = input;
    }
  }

  return min;
}

function solve2(lines: string[]): number {
  const { seeds, mappings } = parseInput(lines);
  let min = -1;

  for (let i = 0; i < seeds.length; i += 2) {
    const rng = seeds.slice(i, i + 2);
    for (let seed = rng[0]!; seed < rng[0]! + rng[1]!; seed++) {
      let input = seed;
      for (const m of mappings) {
        input = getTarget(input, m);
      }
      min = min === -1 || input < min ? input : min;
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
}
