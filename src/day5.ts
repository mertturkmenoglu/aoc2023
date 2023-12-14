type TMap = {
  dst: number;
  src: number;
  length: number;
};

type TInput = {
  seeds: number[];
  mappings: TMap[][];
};

function getSections(lines: string[]): [seeds: string[], rest: string[][]] {
  const sections: string[][] = [];
  const tmp: string[] = [];

  for (const line of lines) {
    if (line.trim() !== '') {
      tmp.push(line);
    } else {
      sections.push([...tmp]);
      tmp.length = 0;
    }
  }

  sections.push([...tmp]);
  const [seeds, ...rest] = sections;
  return [seeds!, rest];
}

function parseSeeds(seeds: string[]): number[] {
  const [_, str] = seeds[0]!.split(': ');
  return str!.split(' ').map(parseFloat);
}

function parseMapLine(s: string): TMap {
  const [dst, src, l] = s.split(' ');
  return { dst: +dst!, src: +src!, length: +l! };
}

function parseMappings(mappings: string[][]): TMap[][] {
  return mappings.map((m) => m.slice(1).map(parseMapLine));
}

function parseInput(lines: string[]): TInput {
  const [seeds, rest] = getSections(lines);

  return {
    seeds: parseSeeds(seeds),
    mappings: parseMappings(rest),
  };
}

function getMap(x: number, maps: TMap[]): TMap | undefined {
  return maps.find((m) => x >= m.src && x <= m.src + m.length - 1);
}

function getTarget(x: number, maps: TMap[]): number {
  const map = getMap(x, maps);
  return map ? map.dst + (x - map.src) : x;
}

function seedToLocation(seed: number, mappings: TMap[][]): number {
  return mappings.reduce((acc, m) => getTarget(acc, m), seed);
}

export const expected1 = 322500873;
export function solve1(lines: string[]): number {
  const { seeds, mappings } = parseInput(lines);
  return Math.min(...seeds.map((seed) => seedToLocation(seed, mappings)));
}

export const expected2 = 108956227;
export function solve2(lines: string[]): number {
  const { seeds, mappings } = parseInput(lines);
  let min = Number.POSITIVE_INFINITY;
  const ranges: [number, number][] = [];

  for (let i = 0; i < seeds.length; i += 2) {
    ranges.push([seeds[i]!, seeds[i + 1]!]);
  }

  for (const [start, len] of ranges) {
    let seed = start;
    while (seed < start + len) {
      const map = getMap(seed, mappings[0]!);
      min = Math.min(min, seedToLocation(seed, mappings));
      seed = map ? map.src + map.length : seed + len;
    }
  }

  return min;
}
