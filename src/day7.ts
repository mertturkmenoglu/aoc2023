const handTypes = ['High', 'One', 'Two', 'Three', 'FullHouse', 'Four', 'Five'] as const;
type HandType = typeof handTypes[number];

type Hand = {
  cards: string[];
  type: HandType;
  bid: number;
}

function computeType(cards: string[]): HandType {
  const asSet = new Set(cards);
  if (asSet.size === 5) return 'High';
  if (asSet.size === 1) return 'Five';
  const groupedByCount = new Map<string, number>();

  for (const card of cards) {
    if (groupedByCount.has(card)) {
      groupedByCount.set(card, groupedByCount.get(card)! + 1);
    } else {
      groupedByCount.set(card, 1);
    }
  }

  if (groupedByCount.size === 4) return 'One';

  if (groupedByCount.size === 2) {
    for (const [_, count] of groupedByCount.entries()) {
      if (count === 4) return 'Four';
    }

    return 'FullHouse';
  }

  for (const [_, count] of groupedByCount.entries()) {
    if (count === 3) return 'Three';
  }

  return 'Two';
}

function computeType2(cards: string[]): HandType {
  const groupedByCount = new Map<string, number>();
  let jCounter = 0;

  for (const card of cards) {
    if (card === 'J') {
      jCounter++;
      continue;
    }

    if (groupedByCount.has(card)) {
      groupedByCount.set(card, groupedByCount.get(card)! + 1);
    } else {
      groupedByCount.set(card, 1);
    }
  }

  const entries = [...groupedByCount.entries()]
  entries.sort((a, b) => a[1] - b[1]);
  const max = entries[entries.length - 1]
  if (max) {
    groupedByCount.set(max[0], max[1] + jCounter);
  } else {
    groupedByCount.set('J', 5);
  }

  if (groupedByCount.size === 5) return 'High';
  if (groupedByCount.size === 1) return 'Five';

  if (groupedByCount.size === 4) return 'One';

  if (groupedByCount.size === 2) {
    for (const [_, count] of groupedByCount.entries()) {
      if (count === 4) return 'Four';
    }

    return 'FullHouse';
  }

  for (const [_, count] of groupedByCount.entries()) {
    if (count === 3) return 'Three';
  }

  return 'Two';
}

function parseInput(lines: string[], s2?: boolean): Hand[] {
  return lines.map((line) => {
    const [cardsStr, bid] = line.split(' ');
    const cards = cardsStr!.split('');
    const type = s2 ? computeType2(cards) : computeType(cards);
    return {
      cards,
      type,
      bid: +bid!,
    }
  });
}

function getCardValue(card: string, s2?: boolean): number {
  let jValue = s2 ? 1 : 11;
  const mapping: Record<string, number> = {A: 14, K: 13, Q: 12, J: jValue, T: 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2};
  const v = mapping[card];
  if (!v) {
    throw Error(`Invalid card: ${card}`);
  }
  return v;
}

function compareHands(a: Hand, b: Hand, s2?: boolean): number {
  const aIndex = handTypes.indexOf(a.type);
  const bIndex = handTypes.indexOf(b.type);

  if (aIndex !== bIndex) {
    return aIndex - bIndex;
  }

  for (let i = 0; i < a.cards.length; i++) {
    const cardA = getCardValue(a.cards[i]!, s2);
    const cardB = getCardValue(b.cards[i]!, s2);

    if (cardA !== cardB) {
      return cardA - cardB;
    }
  }

  return 0;
}

export const expected1 = 253910319;
export function solve1(lines: string[]): number {
  const hands = parseInput(lines);
  hands.sort(compareHands);
  return hands.reduce((acc, hand, i) => acc + hand.bid * (i+1), 0);
}

export const expected2 = -1;
export function solve2(lines: string[]): number {
  const hands = parseInput(lines, true);
  hands.sort((a, b) => compareHands(a, b, true));
  return hands.reduce((acc, hand, i) => acc + hand.bid * (i+1), 0);
}
