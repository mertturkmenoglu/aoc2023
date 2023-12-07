const handTypes = ['High', 'One', 'Two', 'Three', 'FullHouse', 'Four', 'Five'] as const;
type HandType = typeof handTypes[number];

type Hand = {
  cards: string[];
  type: HandType;
  bid: number;
}

function typeFromGroup(group: Map<string, number>): HandType {
  const count = (n: number) => ([...group.entries()].some(([_, count]) => count === n));
  switch (group.size) {
    case 1: return 'Five';
    case 2: return count(4) ? 'Four' : 'FullHouse';
    case 3: return count(3) ? 'Three' : 'Two';
    case 4: return 'One';
    case 5: return 'High';
  }
  throw new Error('Cannot get hang type');
}

function computeType(cards: string[], s2?: boolean): HandType {
  const group = new Map<string, number>();
  let jCounter = 0;

  for (const card of cards) {
    if (!s2 || (s2 && card !== 'J')) {
      group.set(card, (group.get(card) ?? 0) + 1);
    } else {
      jCounter++;
    }
  }

  if (s2) {
    const entries = [...group.entries()].sort((a, b) => a[1] - b[1]);
    const max = entries[entries.length - 1]
    const [k, v] = max ? [max[0], max[1] + jCounter] : ['J', 5];
    group.set(k, v);
  }

  return typeFromGroup(group);
}

function parseInput(lines: string[], s2?: boolean): Hand[] {
  return lines.map((line) => {
    const [cardsStr, bid] = line.split(' ');
    const cards = cardsStr!.split('');
    const type = computeType(cards, s2);
    return { cards, type, bid: +bid! };
  });
}

function getCardValue(card: string, s2?: boolean): number {
  const map: Record<string, number> = {A: 14, K: 13, Q: 12, J: s2 ? 1 : 11, T: 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2};
  const v = map[card];
  if (!v) throw Error(`Invalid card: ${card}`);
  return v;
}

function compareHands(a: Hand, b: Hand, s2?: boolean): number {
  const [ai, bi] = [a, b].map(x => handTypes.indexOf(x.type));
  return ai !== bi ? ai! - bi! : (a.cards.map((cardA, i) => getCardValue(cardA, s2) - getCardValue(b.cards[i]!, s2)).find((v) => v !== 0) ?? 0);
}

export const expected1 = 253910319;
export function solve1(lines: string[]): number {
  const hands = parseInput(lines);
  hands.sort(compareHands);
  return hands.reduce((acc, hand, i) => acc + hand.bid * (i+1), 0);
}

export const expected2 = 254083736;
export function solve2(lines: string[]): number {
  const hands = parseInput(lines, true);
  hands.sort((a, b) => compareHands(a, b, true));
  return hands.reduce((acc, hand, i) => acc + hand.bid * (i+1), 0);
}
