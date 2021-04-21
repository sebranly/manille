import { CardRank } from './types';

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
    if (points1 > points2) return 1;
    if (points1 === points2) return 0;

    return -1;
  }

  const value1 = getLowCardNumericValue(rank1);
  const value2 = getLowCardNumericValue(rank2);

  if (value1 > value2) return 1;
  if (value1 === value2) return 0;

  return -1;
};
