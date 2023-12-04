import { assert } from 'node:console';
import fs from 'node:fs';
  
function toNum(s: string): number[] {
  return s.split(' ').filter(x => x !== '').map(x => +x);
};

function parseLine(line: string): [number[], number[]] {
  const [w, o] = line.split(":")[1]!.split("|");
  return [toNum(w!), toNum(o!)];
}

function matches([w, o]: [number[], number[]]): number {
  return new Set(o.filter(x => w.includes(x))).size;
}

function solve1(lines: string[]): number {
  return lines.reduce((acc, l) => acc + Math.floor(Math.pow(2, matches(parseLine(l)) - 1)), 0);
}

function solve2(lines: string[]) {
  const m = new Array(lines.length).fill(1);

  for (let i = 0; i < m.length; i++) {
    const count = matches(parseLine(lines[i]!));
    for (let j = 1; j <= count; j++) {
      m[i + j] = m[i + j] + m[i];
    }
  }

  return m.reduce((acc, x) => acc + x, 0);
}

export function day4() {
  const lines = fs.readFileSync('src/input4.txt').toString().split('\n');
  const res = [solve1(lines), solve2(lines)];
  console.log(`Day 4 result 1: ${res[0]}`);
  console.log(`Day 4 result 2: ${res[1]}`);
  assert(res[0] === 22897, 'part 1');
  assert(res[1] === 5095824, 'part 2');
}
