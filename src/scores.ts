import { Card, CardRank } from './types';
import { compareValues } from './utils';

export const getCardPoints = (rank: CardRank) => {
  const { Ace, Eight, Jack, King, Nine, Queen, Seven, Ten } = CardRank;

  switch (rank) {
    case Ten:
      return 5;

    case Ace:
      return 4;

    case King:
      return 3;

    case Queen:
      return 2;

    case Jack:
      return 1;

    case Seven:
    case Eight:
    case Nine:
    default:
      return 0;
  }
};

export const getCardsPoints = (cards: Card[]) => {
  const points = cards.map((card: Card) => getCardPoints(card.rank));
  const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue;

  // TODO: find solution not involving cast
  return (points as number[]).reduce(reducer);
};

export const getLowCardNumericValue = (rank: CardRank) => {
  const { Eight, Nine, Seven } = CardRank;

  switch (rank) {
    case Seven:
      return 7;

    case Eight:
      return 8;

    case Nine:
      return 9;

    default:
      return -1;
  }
};

/**
 * Returns whether 1, 0 or -1 based on the comparison of two cards
 */
export const compareCardRanks = (rank1: CardRank, rank2: CardRank) => {
  const points1 = getCardPoints(rank1);
  const points2 = getCardPoints(rank2);

  if (points1 !== 0 || points2 !== 0) {
    return compareValues(points1, points2);
  }

  const value1 = getLowCardNumericValue(rank1);
  const value2 = getLowCardNumericValue(rank2);

  return compareValues(value1, value2);
};
