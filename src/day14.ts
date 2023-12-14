function parseInput(lines: string[]): string[][] {
  return lines.map(line => line.split(''));
}

function shift(arr: string): string {
  const roundRockCount = arr.split('').filter(x => x === 'O').length;
  const rest = arr.length - roundRockCount;
  const newArr: string[] = [];

  for (let i = 0; i < roundRockCount; i++) {
    newArr.push('O');
  }

  for (let i = 0; i < rest; i++) {
    newArr.push('.');
  }

  return newArr.join('');
}

function tiltAndGetLoad(arr: string[]): number {
  const sections = arr.join('').split('#');
  const newChars = sections.map(shift).join('#').split('');
  let load = 0;

  for (let i = 0; i < newChars.length; i++) {
    if (newChars[i] === 'O') {
      load += newChars.length - i;
    }
  }

  return load;
}

function tiltNorth(mtr: string[][]): number {
  let sum = 0;

  for (let i = 0; i < mtr.length; i++) {
    sum += tiltAndGetLoad(mtr.map(row => row[i]!));
  }

  return sum;
}

export const expected1 = 0;
export function solve1(lines: string[]): number {
  const inp = parseInput(lines);
  return tiltNorth(inp);
}

export const expected2 = 0;
export function solve2(lines: string[]): number {
  return lines.length;
}
