import { Card, CardRank, CardSuit } from './types';
import { CARDS_PER_DECK } from './constants';
import { compareCardRanks } from './scores';
import { flattenArray } from './utils';

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

  const cards: Card[] = flattenArray([Clubs, Diamonds, Spades, Hearts].map(generateSuit));

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

export const excludeSuit = (cards: Card[], suit: CardSuit) => {
  const cardsOtherSuits = cards.filter((card: Card) => card.suit !== suit);

  return cardsOtherSuits;
};

export const excludeSuitOver = (cards: Card[], suit: CardSuit, cardRank: CardRank) => {
  const cardsOtherSuitsOrSameSuitLow = cards.filter((card: Card) => {
    return card.suit !== suit || compareCardRanks(cardRank, card.rank) > -1;
  });

  return cardsOtherSuitsOrSameSuitLow;
};

export const excludeCards = (cards: Card[], cardsToExclude: Card[]) => {
  const newCards = cards.filter((card: Card) => !hasCard(cardsToExclude, card));

  return newCards;
};

export const getCardIndex = (cards: Card[], card: Card) => {
  const cardId = cards.findIndex((oneCard: Card) => isSameCard(card, oneCard));

  return cardId;
};

export const isSameCard = (card1: Card, card2: Card) => {
  return card1.rank === card2.rank && card1.suit === card2.suit;
};

export const areSameOrderedCards = (cards1: Card[], cards2: Card[]) => {
  if (cards1.length !== cards2.length) return false;
  return cards1.every((c, i) => isSameCard(c, cards2[i]));
};

export const hasCard = (cards: Card[], card: Card) => {
  const hasIt = cards.some((oneCard: Card) => isSameCard(card, oneCard));

  return hasIt;
};

export const orderCards = (cards: Card[]) => {
  const { Clubs, Diamonds, Hearts, Spades } = CardSuit;

  const clubs = filterBySuit(cards, Clubs);
  const diamonds = filterBySuit(cards, Diamonds);
  const hearts = filterBySuit(cards, Hearts);
  const spades = filterBySuit(cards, Spades);

  const newCardsGroups = [clubs, diamonds, spades, hearts];

  const orderedCardsGroup = newCardsGroups.map(sortSuit);

  return flattenArray(orderedCardsGroup);
};

export const sortSuit = (cardsSuit: Card[]) => {
  return cardsSuit.sort((a, b) => -1 * compareCardRanks(a.rank, b.rank));
};
