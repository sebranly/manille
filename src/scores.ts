import { Card, CardRank } from './types';
import { ORDERED_RANKS, SCORE_THRESHOLD } from './constants';
import { compareValues } from './utils';

/**
 * @name getRankPoints
 * @description Returns the points for a given rank of a card
 */
export const getRankPoints = (rank: CardRank) => {
  const cardPoints = ORDERED_RANKS.find((c) => c.rank === rank);

  if (!cardPoints) return 0;

  return cardPoints.points;
};

/**
 * @name getCardsPoints
 * @description Returns the points for a set of cards
 */
export const getCardsPoints = (cards: Card[]) => {
  const points = cards.map((card: Card) => getRankPoints(card.rank)) as number[];
  const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue;

  return points.reduce(reducer);
};

/**
 * @name getScore
 * @description Returns the score for a hand (round of tricks)
 */
export const getScore = (cards: Card[], multiplier: 1 | 2 | 4 | 8 = 1) => {
  const points = getCardsPoints(cards);

  if (points <= SCORE_THRESHOLD) return 0;

  return (points - SCORE_THRESHOLD) * multiplier;
};

/**
 * @name getPreviousRank
 * @description Returns the previous rank for a given rank
 */
export const getPreviousRank = (rank: CardRank) => {
  const indexRank = ORDERED_RANKS.findIndex((c) => c.rank === rank);

  if (indexRank === -1 || indexRank === 0) return undefined;

  return ORDERED_RANKS[indexRank - 1].rank;
};

/**
 * @name compareCardRanks
 * @description Returns whether 1, 0 or -1 based on the comparison of two cards
 */
export const compareCardRanks = (rank1: CardRank, rank2: CardRank) => {
  const indexCardPoints1 = ORDERED_RANKS.findIndex((c) => c.rank === rank1);
  const indexCardPoints2 = ORDERED_RANKS.findIndex((c) => c.rank === rank2);

  if (indexCardPoints1 === -1 || indexCardPoints2 === -1) return 0;

  return compareValues(indexCardPoints1, indexCardPoints2);
};
