import { cutDeck, generateDeck, generateSuit } from '../cards';
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

test('cutDeck', () => {
  const deck1 = cutDeck(generateDeck(), -1);
  const deck2 = cutDeck(generateDeck(), 0);
  const deck3 = cutDeck(generateDeck(), 16);
  const deck4 = cutDeck(generateDeck(), 32);
  const deck5 = cutDeck(generateDeck(), 33);

  expect(deck1).toHaveLength(32);
  expect(deck1).toStrictEqual(deck2);
  expect(deck2).toStrictEqual(deck3);
  expect(deck3).toStrictEqual(deck4);
  expect(deck4).toStrictEqual(deck5);

  const deck6 = cutDeck(generateDeck(), 10);

  expect(deck6).toMatchSnapshot();
  expect(deck6).toHaveLength(32);
});
