function hash(str: string): number {
  let currentValue = 0;
  const chars = str.split('');

  for (const ch of chars) {
    const asciiCode = ch.charCodeAt(0);
    currentValue += asciiCode;
    currentValue *= 17;
    currentValue %= 256;
  }

  return currentValue;
}

function parseInput(line: string): string[] {
  return line.split(',');
}

export const expected1 = 0;
export function solve1(lines: string[]): number {
  return parseInput(lines[0]!).map(hash).reduce((acc, x) => acc + x, 0);
}

export const expected2 = 0;
export function solve2(lines: string[]): number {
  return lines.length;
}
