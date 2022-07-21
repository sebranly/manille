import { generateSuit } from '../cards';
import { CardRank, CardSuit } from '../types';
import { compareValues, flattenArray, getSureValues, adjustValues } from '../utils';

const { Clubs, Diamonds, Hearts, Spades } = CardSuit;
const { King, Queen, Jack, Nine } = CardRank;

const card1 = { rank: King, suit: Diamonds };
const card2 = { rank: King, suit: Clubs };
const card3 = { rank: King, suit: Spades };
const card4 = { rank: King, suit: Hearts };
const card5 = { rank: Queen, suit: Diamonds };
const card6 = { rank: Queen, suit: Clubs };
const card7 = { rank: Queen, suit: Spades };
const card8 = { rank: Queen, suit: Hearts };
const card9 = { rank: Jack, suit: Diamonds };
const card10 = { rank: Jack, suit: Clubs };
const card11 = { rank: Jack, suit: Spades };

test('compareValues', () => {
  // Output is 1
  expect(compareValues(1, -1)).toBe(1);
  expect(compareValues(1, 0)).toBe(1);
  expect(compareValues(2, 0)).toBe(1);
  expect(compareValues(2, 1)).toBe(1);

  // Output is 0
  expect(compareValues(-1, -1)).toBe(0);
  expect(compareValues(0, 0)).toBe(0);
  expect(compareValues(1, 1)).toBe(0);

  // Output is -1
  expect(compareValues(-1, 1)).toBe(-1);
  expect(compareValues(0, 1)).toBe(-1);
  expect(compareValues(0, 2)).toBe(-1);
  expect(compareValues(1, 2)).toBe(-1);
});

test('flattenArray', () => {
  const clubs = generateSuit(Clubs);
  const diamonds = generateSuit(Diamonds);
  const hearts = generateSuit(Hearts);
  const spades = generateSuit(Spades);

  const deepArray = [clubs, diamonds, hearts, spades];

  const flatArray = flattenArray(deepArray);
  expect(flatArray).toHaveLength(32);
  expect(flatArray).toMatchSnapshot();
});

test('getSureValues', () => {
  expect(getSureValues([[]])).toStrictEqual([[]]);
  expect(getSureValues([[], []])).toStrictEqual([[], []]);
  expect(getSureValues([[card1], [card2], [card3], [card4]])).toStrictEqual([[card1], [card2], [card3], [card4]]);
  expect(
    getSureValues([
      [card1, card5],
      [card2, card6],
      [card3, card7],
      [card4, card8, card9]
    ])
  ).toStrictEqual([
    [card1, card5],
    [card2, card6],
    [card3, card7],
    [card4, card8, card9]
  ]);

  expect(
    getSureValues([
      [card1, card2, card3, card4],
      [card1, card2, card3, card4],
      [card3, card1, card2, card4],
      [card4, card4, card4, card2, card1, card3]
    ])
  ).toStrictEqual([[], [], [], []]);

  expect(getSureValues([[card1, card2, card3, card4], [card1], [card3], [card2]])).toStrictEqual([[card4], [], [], []]);
});

test('adjustValues', () => {
  let result;

  expect(adjustValues([[]], [1])).toStrictEqual([[]]);
  expect(adjustValues([[], []], [1, 1])).toStrictEqual([[], []]);

  result = adjustValues([[card1], [card2], [card3], [card4]], [1, 1, 1, 1]);
  expect(result).toStrictEqual([[card1], [card2], [card3], [card4]]);

  result = adjustValues(
    [
      [card1, card5],
      [card2, card6],
      [card3, card7],
      [card4, card8, card9]
    ],
    [2, 2, 2, 3]
  );

  expect(result).toStrictEqual([
    [card1, card5],
    [card2, card6],
    [card3, card7],
    [card4, card8, card9]
  ]);

  result = adjustValues([[card1], [card2, card6], [card3, card7, card9], [card4, card8, card10, card11]], [1, 2, 3, 4]);
  expect(result).toStrictEqual([[card1], [card2, card6], [card3, card7, card9], [card4, card8, card10, card11]]);

  result = adjustValues([[card1], [card1, card2, card6], [card1, card2, card6, card3, card7, card9], [card1, card2, card6, card3, card7, card9, card4, card8, card10, card11]], [1, 2, 3, 4]);

  expect(result).toStrictEqual([[card1], [card2, card6], [card3, card7, card9], [card4, card8, card10, card11]]);

  result = adjustValues([[card1, card2, card6, card3, card7, card9, card4, card8, card10, card11], [card1, card2, card6, card3, card7, card9], [card1, card2, card6], [card1]], [4, 3, 2, 1]);

  expect(result).toStrictEqual([[card4, card8, card10, card11], [card3, card7, card9], [card2, card6], [card1]]);

  result = adjustValues([[card1], [card1, card2, card6, card3, card7, card9, card4, card8, card10, card11], [card1, card2, card6], [card1, card2, card6, card3, card7, card9]], [1, 4, 2, 3]);

  expect(result).toStrictEqual([[card1], [card4, card8, card10, card11], [card2, card6], [card3, card7, card9]]);

  // TODO: legacy, remove by comparing with above
  result = adjustValues(
    [
      [{ rank: King, suit: Spades }],
      [{ rank: Queen, suit: Spades }],
      [
        { rank: King, suit: Spades },
        { rank: Queen, suit: Spades },
        { rank: Jack, suit: Spades },
        { rank: Nine, suit: Spades }
      ],
      [
        { rank: King, suit: Hearts },
        { rank: Queen, suit: Diamonds }
      ]
    ],
    [1, 1, 2, 2]
  );

  expect(result).toStrictEqual([
    [{ rank: King, suit: Spades }],
    [{ rank: Queen, suit: Spades }],
    [
      { rank: Jack, suit: Spades },
      { rank: Nine, suit: Spades }
    ],
    [
      { rank: King, suit: Hearts },
      { rank: Queen, suit: Diamonds }
    ]
  ]);
});
