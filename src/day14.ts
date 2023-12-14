type Dir = 'N' | 'W' | 'S' | 'E';
type Grid = string[][];

function parseInput(lines: string[]): Grid {
  return lines.map(line => line.split(''));
}

function shift(arr: string, dir: Dir): string {
  const roundRockCount = arr.split('').filter(x => x === 'O').length;
  const rest = arr.length - roundRockCount;
  const newArr: string[] = [];

  if (dir === 'N' || dir === 'W') {
    for (let i = 0; i < roundRockCount; i++) {
      newArr.push('O');
    }

    for (let i = 0; i < rest; i++) {
      newArr.push('.');
    }
  } else {
    for (let i = 0; i < rest; i++) {
      newArr.push('.');
    }

    for (let i = 0; i < roundRockCount; i++) {
      newArr.push('O');
    }
  }

  return newArr.join('');
}

function getLoad(mtr: Grid): number {
  let load = 0;

  for (let i = 0; i < mtr.length; i++) {
    for (let j = 0; j < mtr[i]!.length; j++) {
      if (mtr[i]![j]! === 'O') {
        load += mtr.length - i;
      }
    }
  }

  return load;
}

function tiltVert(mtr: string[][], dir: 'N' | 'S') {
  for (let col = 0; col < mtr[0]!.length; col++) {
    const arr = mtr.map(row => row[col]!);
    const sections = arr.join('').split('#');
    const newChars = sections.map(x => shift(x, dir)).join('#').split('');

    for (let row = 0; row < mtr.length; row++) {
      mtr[row]![col]! = newChars[row]!;
    }
  }
}

function tiltHor(mtr: string[][], dir: 'W' | 'E') {
  for (let row = 0; row < mtr.length; row++) {
    const sections = mtr[row]!.join('').split('#');
    const newChars = sections.map(x => shift(x, dir)).join('#').split('');

    for (let col = 0; col < mtr[row]!.length; col++) {
      mtr[row]![col]! = newChars[col]!;
    }
  }
}

function cycle(mtr: Grid) {
  tiltVert(mtr, 'N');
  tiltHor(mtr, 'W');
  tiltVert(mtr, 'S');
  tiltHor(mtr, 'E');
}

export const expected1 = 109833;
export function solve1(lines: string[]): number {
  const mtr = parseInput(lines);
  tiltVert(mtr, 'N');
  return getLoad(mtr);
}

export const expected2 = 99_875;
export function solve2(lines: string[]): number {
  const mtr = parseInput(lines);
  const CYCLE_COUNT = 1_000_000_000;
  const prev = new Map<string, number>();

	while (true) {
    cycle(mtr);
    const key = JSON.stringify(mtr);

    if (!prev.has(key)) {
      prev.set(key, 1);
      continue;
    }

		const seenTimes = prev.get(key)!;

		if (seenTimes === 2) break;

		prev.set(key, 2);
	}

	const states = [...prev].filter(([, seen]) => seen === 2)
		.map(([key]) => JSON.parse(key) as Grid);

	const offset = prev.size - states.length;
	const i = (CYCLE_COUNT - offset) % states.length;

  return getLoad(states[i - 1]!);
}
