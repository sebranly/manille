import { getPlayableCards } from '../game';
import { CardRank, CardSuit } from '../types';

const { Ace, Eight, Jack, King, Nine, Queen, Seven, Ten } = CardRank;
const { Clubs, Diamonds, Hearts, Spades } = CardSuit;

test('getPlayableCards', () => {
  // It returns empty if empty ~ no played cards
  const c1 = getPlayableCards([], [], 0, 0, false);
  expect(c1).toStrictEqual([]);

  const c2 = getPlayableCards([], [], 0, 1, false);
  expect(c2).toStrictEqual([]);

  const c3 = getPlayableCards([], [], 0, 2, false);
  expect(c3).toStrictEqual([]);

  const c4 = getPlayableCards([], [], 0, 0, Spades);
  expect(c4).toStrictEqual([]);

  const c5 = getPlayableCards([], [], 0, 1, Spades);
  expect(c5).toStrictEqual([]);

  const c6 = getPlayableCards([], [], 0, 2, Spades);
  expect(c6).toStrictEqual([]);

  // It returns empty if empty ~ some played cards
  const c7 = getPlayableCards(
    [],
    [
      { rank: Ace, suit: Diamonds },
      { rank: King, suit: Diamonds },
      { rank: Jack, suit: Diamonds }
    ],
    0,
    1,
    false
  );

  expect(c7).toStrictEqual([]);

  const c8 = getPlayableCards(
    [],
    [
      { rank: King, suit: Diamonds },
      { rank: Jack, suit: Diamonds }
    ],
    0,
    2,
    false
  );

  expect(c8).toStrictEqual([]);

  const c9 = getPlayableCards(
    [],
    [
      { rank: Ace, suit: Diamonds },
      { rank: King, suit: Diamonds },
      { rank: Jack, suit: Diamonds }
    ],
    0,
    1,
    Spades
  );

  expect(c9).toStrictEqual([]);

  const c10 = getPlayableCards(
    [],
    [
      { rank: King, suit: Diamonds },
      { rank: Jack, suit: Diamonds }
    ],
    0,
    2,
    Spades
  );

  expect(c10).toStrictEqual([]);

  // It returns all cards if player starts
  const cards = [
    { rank: Eight, suit: Diamonds },
    { rank: Jack, suit: Spades },
    { rank: Seven, suit: Diamonds },
    { rank: Ace, suit: Hearts },
    { rank: Ace, suit: Spades },
    { rank: Ten, suit: Spades },
    { rank: Nine, suit: Clubs },
    { rank: King, suit: Clubs }
  ];

  const copyCards = [...cards];

  const c11 = getPlayableCards(cards, [], 0, 0, false);
  expect(c11).toStrictEqual(copyCards);
  expect(c11).toHaveLength(8);

  const c12 = getPlayableCards(cards, [], 0, 0, Diamonds);
  expect(c12).toStrictEqual(copyCards);
  expect(c12).toHaveLength(8);

  const c13 = getPlayableCards(cards, [], 1, 1, false);
  expect(c13).toStrictEqual(copyCards);
  expect(c13).toHaveLength(8);

  const c14 = getPlayableCards(cards, [], 1, 1, Diamonds);
  expect(c14).toStrictEqual(copyCards);
  expect(c14).toHaveLength(8);

  const oneCard = [{ rank: Eight, suit: Diamonds }];
  const copyOneCard = [...oneCard];

  // It returns one card if player only have one card left
  const c15 = getPlayableCards(
    oneCard,
    [
      { rank: Ace, suit: Diamonds },
      { rank: King, suit: Diamonds },
      { rank: Jack, suit: Diamonds }
    ],
    0,
    1,
    false
  );

  expect(c15).toStrictEqual(copyOneCard);

  const c16 = getPlayableCards(
    oneCard,
    [
      { rank: King, suit: Diamonds },
      { rank: Jack, suit: Diamonds }
    ],
    0,
    2,
    false
  );

  expect(c16).toStrictEqual(copyOneCard);

  const c17 = getPlayableCards(
    oneCard,
    [
      { rank: Ace, suit: Diamonds },
      { rank: King, suit: Diamonds },
      { rank: Jack, suit: Diamonds }
    ],
    0,
    1,
    Spades
  );

  expect(c17).toStrictEqual(copyOneCard);

  const c18 = getPlayableCards(
    oneCard,
    [
      { rank: King, suit: Diamonds },
      { rank: Jack, suit: Diamonds }
    ],
    0,
    2,
    Spades
  );

  expect(c18).toStrictEqual(copyOneCard);

  // TODO: add tests for atout/trump suit etc.
});
