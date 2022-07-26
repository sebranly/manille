import { Card, CardPoints, CardRank, CardSuit } from './types';
import { CARDS_PER_DECK } from './constants';
import { compareCardRanks } from './scores';
import { flattenArray } from './utils';
import { ORDERED_RANKS } from './constants';

/**
 * @name generateSuit
 * @description Generates a full suit by following Manille's values (DESC sort)
 */
export const generateSuit = (suit: CardSuit) => {
  const cards: Card[] = ORDERED_RANKS.map((cardPoints: CardPoints) => ({ rank: cardPoints.rank, suit }));

  return cards.reverse();
};

/**
 * @name generateDeck
 * @description Generates a full deck with an arbitrary order (same as `sortCards`)
 */
export const generateDeck = () => {
  const { Clubs, Diamonds, Hearts, Spades } = CardSuit;

  const cards: Card[] = flattenArray([Clubs, Diamonds, Spades, Hearts].map(generateSuit));

  return cards;
};

/**
 * @name cutDeck
 * @description Cuts a deck into two parts then join them
 */
export const cutDeck = (cards: Card[], cardsBefore: number) => {
  const isInvalidCardsBefore = cardsBefore <= 0 || cardsBefore >= CARDS_PER_DECK;
  const safeCardsBefore = isInvalidCardsBefore ? CARDS_PER_DECK / 2 : cardsBefore;

  const part1 = cards.slice(0, safeCardsBefore);
  const part2 = cards.slice(safeCardsBefore);

  return [...part2, ...part1];
};

/**
 * @name filterBySuit
 * @description Returns only the cards from the same suit
 */
export const filterBySuit = (cards: Card[], suit: CardSuit | false) => {
  if (!suit) return [];

  const cardsSuit = cards.filter((card: Card) => card.suit === suit);

  return cardsSuit;
};

/**
 * @name excludeSuit
 * @description Returns only the cards from the other suits
 */
export const excludeSuit = (cards: Card[], suit: CardSuit) => {
  const cardsOtherSuits = cards.filter((card: Card) => card.suit !== suit);

  return cardsOtherSuits;
};

/**
 * @name excludeSuitOver
 * @description Returns only the cards from the other suits and the cards from the same suit which have a better rank
 */
export const excludeSuitOver = (cards: Card[], suit: CardSuit, cardRank: CardRank) => {
  const cardsOtherSuitsOrSameSuitLow = cards.filter((card: Card) => {
    return card.suit !== suit || compareCardRanks(cardRank, card.rank) > -1;
  });

  return cardsOtherSuitsOrSameSuitLow;
};

/**
 * @name getCardId
 * @description Returns the id of the card if found, otherwise -1
 */
export const getCardId = (cards: Card[], card: Card) => {
  const cardId = cards.findIndex((oneCard: Card) => isEqual(card, oneCard));

  return cardId;
};

/**
 * @name isEqual
 * @description Returns whether two cards are the same
 */
export const isEqual = (card1: Card, card2: Card) => {
  return card1.rank === card2.rank && card1.suit === card2.suit;
};

/**
 * @name areEqual
 * @description Returns whether two sets of cards contain the same cards (order is not important)
 */
export const areEqual = (cards1: Card[], cards2: Card[]) => {
  if (cards1.length !== cards2.length) return false;

  return cards1.every((c) => hasCard(cards2, c));
};

/**
 * @name hasCard
 * @description Returns whether a set of cards has a specific card
 */
export const hasCard = (cards: Card[], card: Card) => {
  const hasIt = getCardId(cards, card) !== -1;

  return hasIt;
};

/**
 * @name differenceWith
 * @description Returns the cards present in the first set but not in the second set
 */
export const differenceWith = (cards1: Card[], cards2: Card[]) => {
  return cards1.filter((card) => !hasCard(cards2, card));
};

/**
 * @name sortCards
 * @description Sorts all the cards with an arbitrary order (same as `generateDeck`)
 */
export const sortCards = (cards: Card[]) => {
  const { Clubs, Diamonds, Hearts, Spades } = CardSuit;

  const clubs = filterBySuit(cards, Clubs);
  const diamonds = filterBySuit(cards, Diamonds);
  const hearts = filterBySuit(cards, Hearts);
  const spades = filterBySuit(cards, Spades);

  const newCardsGroups = [clubs, diamonds, spades, hearts];

  const sortedCards = newCardsGroups.map(sortSuit);

  return flattenArray(sortedCards);
};

/**
 * @name sortSuit
 * @description Sorts cards from a same suit (DESC order)
 */
export const sortSuit = (cardsSuit: Card[]) => {
  return cardsSuit.sort((a, b) => -1 * compareCardRanks(a.rank, b.rank));
};
