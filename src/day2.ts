type Game = {
  id: number;
  reveals: Reveal[];
};

type Reveal = {
  red: number;
  green: number;
  blue: number;
};

function parseGame(line: string, i: number): Game {
  const [gameStr, rest] = line.split(':');

  if (!gameStr || !rest) {
    throw Error(`Invalid format for line ${i + 1}`);
  }

  const [_, idStr] = gameStr.split(' ');

  if (!idStr) {
    throw Error(`Invalid game id format for line ${i + 1}`);
  }

  const reveals: Reveal[] = [];
  const revs = rest.split(';');

  for (const rev of revs) {
    const parsedReveal: Reveal = {
      red: 0,
      green: 0,
      blue: 0,
    };

    const sections = rev.trim().split(', ');

    for (const sec of sections) {
      const [numStr, color] = sec.split(' ');
      if (!numStr || !color) {
        throw Error(`Invalid format for line ${i + 1}: Cannot parse sections`);
      }
      if (color === 'red' || color === 'green' || color === 'blue') {
        parsedReveal[color] = +numStr;
      } else {
        throw Error(`Invalid color at line ${i + 1}: Got ${color}`);
      }
    }

    reveals.push(parsedReveal);
  }

  return {
    id: +idStr,
    reveals: reveals,
  };
}

function isGamePossible(game: Game, c: Reveal): boolean {
  for (const r of game.reveals) {
    if (r.red > c.red || r.green > c.green || r.blue > c.blue) {
      return false;
    }
  }

  return true;
}

function power(game: Game): number {
  let minRed = 1;
  let minGreen = 1;
  let minBlue = 1;

  for (const r of game.reveals) {
    if (r.red > minRed) {
      minRed = r.red;
    }

    if (r.green > minGreen) {
      minGreen = r.green;
    }

    if (r.blue > minBlue) {
      minBlue = r.blue
    }
  }

  return minRed * minGreen * minBlue;
}

export const expected1 = 2545;
export function solve1(lines: string[]): number {
  const constraint: Reveal = {
    red: 12,
    green: 13,
    blue: 14,
  };
  let sum = 0;

  for (let i = 0; i < lines.length; i++) {
    // Parse game
    const line = lines[i]!;
    const game = parseGame(line, i);

    // Check if this game is possible
    if (isGamePossible(game, constraint)) {
      sum += game.id;
    }
  }

  return sum;
}

export const expected2 = 78111;
export function solve2(lines: string[]): number {
  let sum = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const game = parseGame(line, i);

    const pwr = power(game);
    sum += pwr;
  }

  return sum;
}
