import { Card, CardRank, CardSuit } from './types';

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
