type TNode = {
  value: string;
  left: string;
  right: string;
};

type TInput = {
  instructions: string[];
  network: TNode[];
};

function parseNetwork(lines: string[]): TNode[] {
  return lines.map((line) => {
    const [value, rest] = line.split("=").map(x => x.trim()) as [string, string];
    const [left, right] = rest!.split("").slice(1, rest!.length - 1).join("").split(",").map(x => x.trim()) as [string, string];
    return { value, left, right };
  });
}

function parseInput(lines: string[]): TInput {
  const [instructionsLine, _, ...rest] = lines;
  return {
    instructions: instructionsLine!.split(""),
    network: parseNetwork(rest),
  };
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

function findSteps(pos: TNode, { instructions, network }: TInput, sol: number): number {
  let steps = 0;
  let i = network.findIndex((v) => v.value === pos.value);
  let ii = 0;
  let curr = network[i]!;
  let ins = instructions[ii]!;

  while (!curr.value.endsWith(sol === 1 ? "ZZZ" : "Z")) {
    const next = ins === "L" ? curr.left : curr.right;
    i = network.findIndex((v) => v.value === next);
    curr = network[i]!
    ii = (ii + 1) % instructions.length;
    ins = instructions[ii]!;
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
