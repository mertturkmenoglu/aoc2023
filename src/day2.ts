type Game = {
  id: number;
  reveals: Reveal[];
};

type Reveal = {
  red: number;
  green: number;
  blue: number;
};

function parseGame(line: string): Game {
  const [gameStr, rest] = line.split(':');
  return {
    id: +gameStr!.split(' ')[1]!,
    reveals: rest!.split(';').map((rev) => {
      const parsedReveal: Reveal = { red: 0, green: 0, blue: 0 };

      for (const sec of rev.trim().split(', ')) {
        const [numStr, color] = sec.split(' ');
        if (color === 'red' || color === 'green' || color === 'blue') {
          parsedReveal[color] = +numStr!;
        }
      }

      return parsedReveal;
    }),
  };
}

function isGamePossible(game: Game, c: Reveal): boolean {
  return !game.reveals.some((r) => r.red > c.red || r.green > c.green || r.blue > c.blue);
}

function power(game: Game): number {
  let minRed = 1, minGreen = 1, minBlue = 1;

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
  const constraint: Reveal = { red: 12, green: 13, blue: 14 };
  return lines.map(parseGame).reduce((acc, g) => acc + (isGamePossible(g, constraint) ? g.id : 0), 0)
}

export const expected2 = 78111;
export function solve2(lines: string[]): number {
  return lines.map((l) => power(parseGame(l))).reduce((acc, x) => acc + x, 0);
}
