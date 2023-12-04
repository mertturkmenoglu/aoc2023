import { assert } from 'node:console';
import fs from 'node:fs';
  
const transform = (s: string): number[] => {
  return s.split(' ').map(x => x.trim()).filter(x => x !== '').map(x => +x);
};

function parseLine(line: string): [number[], number[]] {
  const [winStr, ourStr] = line.split(":")[1]!.split("|").map(x => x.trim());
  return [transform(winStr!), transform(ourStr!)];
}

function solve1(lines: string[]): number {
  return lines.reduce((acc, line) => {
    const [wins, ours] = parseLine(line);
    const l = new Set(ours.filter(x => wins.includes(x))).size;
    return acc + Math.floor(Math.pow(2, l-1));
  }, 0);
}

function solve2(lines: string[]) {
  return lines.length;
}

export function day4() {
  const lines = fs.readFileSync('src/input4.txt').toString().split('\n');
  const res = [solve1(lines), solve2(lines)];
  console.log(`Day 4 result 1: ${res[0]}`);
  console.log(`Day 4 result 2: ${res[1]}`);
  assert(res[0] === 22897, 'part 1');
}