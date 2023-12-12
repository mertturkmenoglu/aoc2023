type Row = [chars: string[], groups: number[]];

function parseInput(lines: string[]): Row[] {
  return lines.map((line) => {
    const [charsSec, groupsSec] = line.split(' ');
    return [charsSec!.split(''), groupsSec!.split(',').map(Number)];
  });
}

function mutate(row: Row): string[] {
  const [chars] = row;
  const stack = [chars.join('')];
  const res: Set<string> = new Set();

  while (stack.length > 0) {
    const s = stack.pop();
    
    if (!s!.includes('?')) {
      res.add(s!);
    } else {
      const c = s!.split('');
      const i = c.indexOf('?');
      c[i] = '.';
      stack.push(c.join(''));
      c[i] = '#';
      stack.push(c.join(''));
    }
  }

  return [...res];
}

function possibleArrangements(row: Row): number {
  const [, groups] = row;
  const mutations = mutate(row).filter(s => {
    const sections = s.split('.').filter(x => x !== '');
    return sections.length === groups.length;
  })
  let counter = 0;

  for (const m of mutations) {
    const parts = m.split('.').filter(x => x !== '');
    if (parts.every((x, i) => x.length === groups[i]!)) {
      counter++;
    }
  }

  return counter;
}

export const expected1 = 8022;
export function solve1(lines: string[]): number {
  return parseInput(lines).map(possibleArrangements).reduce((acc, x) => acc + x, 0);
}

export const expected2 = 0;
export function solve2(lines: string[]): number {
  return lines.length;
}