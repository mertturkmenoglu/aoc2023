interface Lense {
  label: string
  len: number
}

function hash(str: string): number {
  let currentValue = 0;

  for (const ch of str.split('')) {
    currentValue = ((currentValue + ch.charCodeAt(0)) * 17) % 256;
  }

  return currentValue;
}

function parseInput(line: string): string[] {
  return line.split(',');
}

function compute(operations: string[]): number {
  const map = new Map<number, Lense[]>();

  const equal = (op: string): void => {
    const [label, lenstr] = op.split('=');
    const lense: Lense = { label: label!, len: +lenstr! };

    const hashval = hash(label!);
    const lenses = map.get(hashval) ?? [];
    const index = lenses.findIndex((v) => v.label === label);

    if (index === -1) {
      map.set(hashval, [...lenses, lense]);
    } else {
      map.set(hashval, lenses.toSpliced(index, 1, lense) as Lense[]);
    }
  };

  const dash = (op: string): void => {
    const label = op.substring(0, op.length - 1);
    const hashval = hash(label);
    const lenses = map.get(hashval) ?? [];
    map.set(hashval, lenses.filter((v) => v.label !== label));
  };

  for (const operation of operations) {
    const fn = operation.includes('=') ? equal : dash;
    fn(operation);
  }

  const power = (lense: Lense, box: number, i: number): number => {
    return (1 + box) * (i + 1) * lense.len;
  };

  return [...map.entries()]
    .map(([box, lenses]) => lenses.reduce((acc, lense, i) => acc + power(lense, box, i), 0))
    .reduce((acc, x) => acc + x, 0);
}

export const expected1 = 511_416;
export function solve1(lines: string[]): number {
  return parseInput(lines[0]!).map(hash).reduce((acc, x) => acc + x, 0);
}

export const expected2 = 290_779;
export function solve2(lines: string[]): number {
  return compute(parseInput(lines[0]!));
}
