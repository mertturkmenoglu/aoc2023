import { Expect } from '../../../lib/dec';
import { AbstractSolution } from '../../../lib/types';

interface Lense {
  label: string;
  len: number;
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
      map.set(hashval, lenses.toSpliced(index, 1, lense));
    }
  };

  const dash = (op: string): void => {
    const label = op.substring(0, op.length - 1);
    const hashval = hash(label);
    const lenses = map.get(hashval) ?? [];
    map.set(
      hashval,
      lenses.filter((v) => v.label !== label),
    );
  };

  for (const operation of operations) {
    const fn = operation.includes('=') ? equal : dash;
    fn(operation);
  }

  const power = (lense: Lense, box: number, i: number): number => {
    return (1 + box) * (i + 1) * lense.len;
  };

  return [...map.entries()]
    .map(([box, lenses]) =>
      lenses.reduce((acc, lense, i) => acc + power(lense, box, i), 0),
    )
    .reduce((acc, x) => acc + x, 0);
}

export class Solution extends AbstractSolution {
  @Expect(511_416)
  override solve1(): string | number {
    return parseInput(this.lines[0]!)
      .map(hash)
      .reduce((acc, x) => acc + x, 0);
  }

  @Expect(290_779)
  override solve2(): string | number {
    return compute(parseInput(this.lines[0]!));
  }
}
