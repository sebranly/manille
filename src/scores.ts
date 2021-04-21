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

    case Eight:
    case Nine:
    case Seven:
    default:
      return 0;
  }
};
