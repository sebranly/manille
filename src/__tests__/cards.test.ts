import { generateDeck, generateSuit } from '../cards';
import { CardRank, CardSuit } from '../types';

const { Ace, Eight, Jack, King, Nine, Queen, Seven, Ten } = CardRank;

test('generateSuit', () => {
  const { Hearts } = CardSuit;

  expect(generateSuit(Hearts)).toStrictEqual([
    { rank: Ten, suit: Hearts },
    { rank: Ace, suit: Hearts },
    { rank: King, suit: Hearts },
    { rank: Queen, suit: Hearts },
    { rank: Jack, suit: Hearts },
    { rank: Nine, suit: Hearts },
    { rank: Eight, suit: Hearts },
    { rank: Seven, suit: Hearts }
  ]);
});

test('generateDeck', () => {
  const deck = generateDeck();
  expect(deck).toMatchSnapshot();
  expect(deck).toHaveLength(32);
});
