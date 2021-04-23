import { Card, CardRank, CardSuit } from './types';
import { CARDS_PER_DECK } from './constants';

export const generateSuit = (suit: CardSuit) => {
  const { Ace, Eight, Jack, King, Nine, Queen, Seven, Ten } = CardRank;

  const cards: Card[] = [
    { rank: Ten, suit },
    { rank: Ace, suit },
    { rank: King, suit },
    { rank: Queen, suit },
    { rank: Jack, suit },
    { rank: Nine, suit },
    { rank: Eight, suit },
    { rank: Seven, suit }
  ];

  return cards;
};

export const generateDeck = () => {
  const { Clubs, Diamonds, Hearts, Spades } = CardSuit;

  const cards: Card[] = [Clubs, Diamonds, Hearts, Spades].map(generateSuit).reduce((a, b) => a.concat(b));

  return cards;
};

export const cutDeck = (cards: Card[], cardsBefore: number) => {
  const isInvalidCardsBefore = cardsBefore <= 0 || cardsBefore >= CARDS_PER_DECK;
  const safeCardsBefore = isInvalidCardsBefore ? CARDS_PER_DECK / 2 : cardsBefore;

  const part1 = cards.slice(0, safeCardsBefore);
  const part2 = cards.slice(safeCardsBefore);

  return [...part2, ...part1];
};
