function toNum(s: string): number[] {
  return s
    .split(' ')
    .filter((x) => x !== '')
    .map((x) => +x);
}

function parseLine(line: string): [number[], number[]] {
  const [w, o] = line.split(':')[1]!.split('|');
  return [toNum(w!), toNum(o!)];
}

function matches([w, o]: [number[], number[]]): number {
  return new Set(o.filter((x) => w.includes(x))).size;
}

export const expected1 = 22897;
export function solve1(lines: string[]): number {
  return lines.reduce(
    (acc, l) => acc + Math.floor(Math.pow(2, matches(parseLine(l)) - 1)),
    0
  );
}

export const expected2 = 5095824;
export function solve2(lines: string[]): number {
  const m = new Array(lines.length).fill(1);

  for (let i = 0; i < m.length; i++) {
    const count = matches(parseLine(lines[i]!));
    for (let j = 1; j <= count; j++) {
      m[i + j] = m[i + j] + m[i];
    }
  }

  return m.reduce((acc, x) => acc + x, 0);
}
