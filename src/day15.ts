interface Lense {
  label: string
  focalLength: number
}

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

function compute(operations: string[]): number {
  const map = new Map<number, Lense[]>();

  const equal = (op: string): void => {
    const [label, focalLengthStr] = op.split('=');
    const hashval = hash(label!);
    const lenses = map.get(hashval);
    const lense: Lense = { label: label!, focalLength: +focalLengthStr! };
    if (lenses === undefined || lenses.length === 0) {
      map.set(hashval, [lense]);
      return;
    }
    const index = lenses.findIndex((v) => v.label === label);

    if (index === -1) {
      map.set(hashval, [...lenses, lense]);
    } else {
      lenses[index] = lense;
      map.set(hashval, lenses);
    }
  };

  const dash = (op: string): void => {
    const label = op.substring(0, op.length - 1);
    const hashval = hash(label);
    const lenses = map.get(hashval) ?? [];
    map.set(hashval, lenses.filter((v) => v.label !== label));
  };

  for (const operation of operations) {
    if (operation.includes('=')) {
      equal(operation);
    } else {
      dash(operation);
    }
  }

  let sum = 0;

  for (const [boxNumber, lenses] of map) {
    sum += lenses.map((lense, i) => (1 + boxNumber) * (i + 1) * lense.focalLength).reduce((acc, x) => acc + x, 0);
  }

  return sum;
}

export const expected1 = 511_416;
export function solve1(lines: string[]): number {
  return parseInput(lines[0]!).map(hash).reduce((acc, x) => acc + x, 0);
}

export const expected2 = 290_779;
export function solve2(lines: string[]): number {
  return compute(parseInput(lines[0]!));
}
