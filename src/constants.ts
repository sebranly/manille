import { CardPoints, CardRank } from './types';

export const CARDS_PER_DECK = 32;
export const NUMBER_PLAYERS = 4;
export const SCORE_THRESHOLD = 30;

const { Ace, Eight, Jack, King, Nine, Queen, Seven, Ten } = CardRank;

export const ORDERED_RANKS: CardPoints[] = [
  { rank: Seven, points: 0 },
  { rank: Eight, points: 0 },
  { rank: Nine, points: 0 },
  { rank: Jack, points: 1 },
  { rank: Queen, points: 2 },
  { rank: King, points: 3 },
  { rank: Ace, points: 4 },
  { rank: Ten, points: 5 }
];
