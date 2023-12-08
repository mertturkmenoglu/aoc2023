type TDirection = "L" | "R";

type TNode = {
  value: string;
  left: string;
  right: string;
};

type TInput = {
  instructions: TDirection[];
  network: TNode[];
};

function parseInstructions(s: string): TDirection[] {
  return s.trim().split("").map(x => x === "L" ? "L" : "R");
}

function parseNetwork(lines: string[]): TNode[] {
  return lines.map((line) => {
    const [valStr, mapVal] = line.split("=").map(x => x.trim());
    const [leftVal, rightVal] = mapVal!.split("").slice(1, mapVal!.length - 1).join("").split(",").map(x => x.trim());

    return {
      value: valStr!,
      left: leftVal!,
      right: rightVal!,
    }
  });
}

function parseInput(lines: string[]): TInput {
  const [instructionsLine, _emptyLine, ...rest] = lines;

  return {
    instructions: parseInstructions(instructionsLine!),
    network: parseNetwork(rest),
  };
}

export const expected1 = 0;
export function solve1(lines: string[]): number {
  const { instructions, network } = parseInput(lines);
  let steps = 1;
  let i = 0;
  let instructionIndex = 0;
  let curr = network[i]!;
  let instruction = instructions[instructionIndex]!;

  while (curr.value !== "ZZZ") {
    const next = instruction === "L" ? curr.left : curr.right;
    i = network.findIndex((v) => v.value === next);
    curr = network[i]!
    instructionIndex = (instructionIndex + 1) % instructions.length;
    instruction = instructions[instructionIndex]!;
    steps++;
  }

  return steps - 1;
}

export function solve2(lines: string[]): number {
  return lines.length;
}
