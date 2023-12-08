type TNode = {
  value: string;
  left: string;
  right: string;
};

type TInput = {
  instructions: string[];
  network: TNode[];
};

let inp: TInput | null = null;

function parseNetwork(lines: string[]): TNode[] {
  return lines.map((line) => {
    const [value, rest] = line.split("=").map(x => x.trim()) as [string, string];
    const [left, right] = rest.substring(1, rest.length - 1).split(",").map(x => x.trim()) as [string, string];
    return { value, left, right };
  });
}

function parseInput(lines: string[]): TInput {
  if (!inp) {
    const [instructionsLine, _, ...rest] = lines;
    inp = {
      instructions: instructionsLine!.split(""),
      network: parseNetwork(rest).sort((a, b) => a.value.localeCompare(b.value)),
    };
  }
  return inp;
}

function gcd(a: number, b: number): number { 
  let temp = b;

  while (b !== 0) {
    b = a % b;
    a = temp;
    temp = b;
  }
  
  return a; 
} 
  
function lcm(a: number, b: number): number { 
  return (a * b) / gcd(a, b); 
}

function find(network: TNode[], next: string): TNode {
  let lo = 0;
  let hi = network.length;

  while (lo < hi) {
    const m = Math.floor(lo + (hi - lo) / 2);
    const v = network[m]!;
    const cmp = next.localeCompare(v.value);

    if (cmp === 0) {
      return v;
    } else if (cmp === -1) {
      hi = m;
    } else {
      lo = m + 1;
    }
  }

  throw new Error("Cannot find element");
}

function findSteps(pos: TNode, { instructions, network }: TInput, sol: number): number {
  let steps = 0, i = 0, curr = pos, ins = instructions[i]!;
  const token = sol === 1 ? "ZZZ" : "Z"

  while (!curr.value.endsWith(token)) {
    const next = ins === "L" ? curr.left : curr.right;
    curr = find(network, next);
    i = (i + 1) % instructions.length;
    ins = instructions[i]!;
    steps++;
  }

  return steps;
}

export const expected1 = 13019;
export function solve1(lines: string[]): number {
  const input = parseInput(lines);
  return findSteps(input.network[0]!, input, 1);
}

export const expected2 = 13_524_038_372_771;
export function solve2(lines: string[]): number {
  const input = parseInput(lines);
  return input.network.filter((v) => v.value.endsWith("A"))
    .map((p) => findSteps(p, input, 2))
    .reduce((acc, x) => lcm(acc, x));
}
