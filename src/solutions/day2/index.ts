import { Expect } from '../../../lib/dec';
import { AbstractSolution } from '../../../lib/types';

interface Game {
  id: number;
  reveals: Reveal[];
}

interface Reveal {
  red: number;
  green: number;
  blue: number;
}

export class Solution extends AbstractSolution {
  parseGame(line: string): Game {
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

  isGamePossible(game: Game, c: Reveal): boolean {
    return !game.reveals.some(
      (r) => r.red > c.red || r.green > c.green || r.blue > c.blue,
    );
  }

  power(game: Game): number {
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
        minBlue = r.blue;
      }
    }

    return minRed * minGreen * minBlue;
  }

  @Expect(2545)
  solve1(): number {
    const constraint: Reveal = { red: 12, green: 13, blue: 14 };
    return this.lines
      .map((line) => this.parseGame(line))
      .reduce(
        (acc, g) => acc + (this.isGamePossible(g, constraint) ? g.id : 0),
        0,
      );
  }

  @Expect(78_111)
  solve2(): number {
    return this.lines
      .map((line) => this.power(this.parseGame(line)))
      .reduce((acc, x) => acc + x, 0);
  }
}
