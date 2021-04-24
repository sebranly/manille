import { Card, CardRank, CardSuit } from './types';
import { CARDS_PER_DECK } from './constants';
import { compareCardRanks } from './scores';

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

  const cards: Card[] = [Clubs, Diamonds, Spades, Hearts].map(generateSuit).reduce((a, b) => a.concat(b));

  return cards;
};

export const cutDeck = (cards: Card[], cardsBefore: number) => {
  const isInvalidCardsBefore = cardsBefore <= 0 || cardsBefore >= CARDS_PER_DECK;
  const safeCardsBefore = isInvalidCardsBefore ? CARDS_PER_DECK / 2 : cardsBefore;

  const part1 = cards.slice(0, safeCardsBefore);
  const part2 = cards.slice(safeCardsBefore);

  return [...part2, ...part1];
};

export const filterBySuit = (cards: Card[], suit: CardSuit | false) => {
  const cardsSuit = cards.filter((card: Card) => card.suit === suit);

  return cardsSuit;
};

export const orderCards = (cards: Card[]) => {
  const { Clubs, Diamonds, Hearts, Spades } = CardSuit;

  const clubs = filterBySuit(cards, Clubs);
  const diamonds = filterBySuit(cards, Diamonds);
  const hearts = filterBySuit(cards, Hearts);
  const spades = filterBySuit(cards, Spades);

  const newCardsGroups = [clubs, diamonds, spades, hearts];

  const orderedCardsGroup = newCardsGroups.map((cardsGroup: Card[]) => {
    // TODO: create function for it
    return cardsGroup.sort((a, b) => -1 * compareCardRanks(a.rank, b.rank));
  });

  // TODO: create function for it
  return orderedCardsGroup.reduce((a, b) => a.concat(b));
};
