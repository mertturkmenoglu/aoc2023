import { Expect } from '../../../lib/dec';
import { AbstractSolution } from '../../../lib/types';

interface TMap {
  dst: number;
  src: number;
  length: number;
}

interface TInput {
  seeds: number[];
  mappings: TMap[][];
}

export class Solution extends AbstractSolution {
  getSections(): [seeds: string[], rest: string[][]] {
    const sections: string[][] = [];
    const tmp: string[] = [];

    for (const line of this.lines) {
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

  parseSeeds(seeds: string[]): number[] {
    const [, str] = seeds[0]!.split(': ');
    return str!.split(' ').map(parseFloat);
  }

  parseMapLine(s: string): TMap {
    const [dst, src, l] = s.split(' ');
    return { dst: +dst!, src: +src!, length: +l! };
  }

  parseMappings(mappings: string[][]): TMap[][] {
    return mappings.map((m) => m.slice(1).map((x) => this.parseMapLine(x)));
  }

  parseInput(): TInput {
    const [seeds, rest] = this.getSections();

    return {
      seeds: this.parseSeeds(seeds),
      mappings: this.parseMappings(rest),
    };
  }

  getMap(x: number, maps: TMap[]): TMap | undefined {
    return maps.find((m) => x >= m.src && x <= m.src + m.length - 1);
  }

  getTarget(x: number, maps: TMap[]): number {
    const map = this.getMap(x, maps);
    return map !== undefined ? map.dst + (x - map.src) : x;
  }

  seedToLocation(seed: number, mappings: TMap[][]): number {
    return mappings.reduce((acc, m) => this.getTarget(acc, m), seed);
  }

  @Expect(322_500_873)
  override solve1(): string | number {
    const { seeds, mappings } = this.parseInput();
    return Math.min(
      ...seeds.map((seed) => this.seedToLocation(seed, mappings)),
    );
  }

  @Expect(108_956_227)
  override solve2(): string | number {
    const { seeds, mappings } = this.parseInput();
    let min = Number.POSITIVE_INFINITY;
    const ranges: Array<[number, number]> = [];

    for (let i = 0; i < seeds.length; i += 2) {
      ranges.push([seeds[i]!, seeds[i + 1]!]);
    }

    for (const [start, len] of ranges) {
      let seed = start;
      while (seed < start + len) {
        const map = this.getMap(seed, mappings[0]!);
        min = Math.min(min, this.seedToLocation(seed, mappings));
        seed = map !== undefined ? map.src + map.length : seed + len;
      }
    }

    return min;
  }
}
