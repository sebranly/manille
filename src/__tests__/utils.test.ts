import { generateSuit } from '../cards';
import { CardRank, CardSuit } from '../types';
import { compareValues, flattenArray, getUniqueCards, reduceOwnershipCards } from '../utils';

const { Clubs, Diamonds, Hearts, Spades } = CardSuit;
const { King, Queen, Jack, Nine } = CardRank;

const c1 = { rank: King, suit: Diamonds };
const c2 = { rank: King, suit: Clubs };
const c3 = { rank: King, suit: Spades };
const c4 = { rank: King, suit: Hearts };

const c5 = { rank: Queen, suit: Diamonds };
const c6 = { rank: Queen, suit: Clubs };
const c7 = { rank: Queen, suit: Spades };
const c8 = { rank: Queen, suit: Hearts };

const c9 = { rank: Jack, suit: Diamonds };
const c10 = { rank: Jack, suit: Clubs };
const c11 = { rank: Jack, suit: Spades };

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

test('getUniqueCards', () => {
  expect(getUniqueCards([[]])).toStrictEqual([[]]);
  expect(getUniqueCards([[], []])).toStrictEqual([[], []]);
  expect(getUniqueCards([[c1], [c2], [c3], [c4]])).toStrictEqual([[c1], [c2], [c3], [c4]]);
  expect(
    getUniqueCards([
      [c1, c5],
      [c2, c6],
      [c3, c7],
      [c4, c8, c9]
    ])
  ).toStrictEqual([
    [c1, c5],
    [c2, c6],
    [c3, c7],
    [c4, c8, c9]
  ]);

  expect(
    getUniqueCards([
      [c1, c2, c3, c4],
      [c1, c2, c3, c4],
      [c3, c1, c2, c4],
      [c4, c4, c4, c2, c1, c3]
    ])
  ).toStrictEqual([[], [], [], []]);

  expect(getUniqueCards([[c1, c2, c3, c4], [c1], [c3], [c2]])).toStrictEqual([[c4], [], [], []]);
  expect(
    getUniqueCards([
      [c1, c2, c3, c4],
      [c2, c1],
      [c3, c2],
      [c2, c1]
    ])
  ).toStrictEqual([[c4], [], [], []]);

  expect(getUniqueCards([[c1, c2, c5], [c2, c3], [c2, c4], [c5]])).toStrictEqual([[c1], [c3], [c4], []]);
});

test('reduceOwnershipCards', () => {
  let result;

  expect(reduceOwnershipCards([[]], [1])).toStrictEqual([[]]);
  expect(reduceOwnershipCards([[], []], [1, 1])).toStrictEqual([[], []]);

  result = reduceOwnershipCards([[c1], [c2], [c3], [c4]], [1, 1, 1, 1]);
  expect(result).toStrictEqual([[c1], [c2], [c3], [c4]]);

  result = reduceOwnershipCards(
    [
      [c1, c5],
      [c2, c6],
      [c3, c7],
      [c4, c8, c9]
    ],
    [2, 2, 2, 3]
  );

  expect(result).toStrictEqual([
    [c1, c5],
    [c2, c6],
    [c3, c7],
    [c4, c8, c9]
  ]);

  result = reduceOwnershipCards([[c1], [c2, c6], [c3, c7, c9], [c4, c8, c10, c11]], [1, 2, 3, 4]);
  expect(result).toStrictEqual([[c1], [c2, c6], [c3, c7, c9], [c4, c8, c10, c11]]);

  result = reduceOwnershipCards(
    [[c1], [c1, c2, c6], [c1, c2, c6, c3, c7, c9], [c1, c2, c6, c3, c7, c9, c4, c8, c10, c11]],
    [1, 2, 3, 4]
  );

  expect(result).toStrictEqual([[c1], [c2, c6], [c3, c7, c9], [c4, c8, c10, c11]]);

  result = reduceOwnershipCards(
    [[c1, c2, c6, c3, c7, c9, c4, c8, c10, c11], [c1, c2, c6, c3, c7, c9], [c1, c2, c6], [c1]],
    [4, 3, 2, 1]
  );

  expect(result).toStrictEqual([[c4, c8, c10, c11], [c3, c7, c9], [c2, c6], [c1]]);

  result = reduceOwnershipCards(
    [[c1, c2, c6, c3, c7, c9, c4, c8, c10, c11], [c2, c1, c3, c6, c7, c9], [c1, c2, c6], [c1]],
    [4, 3, 2, 1]
  );

  expect(result).toStrictEqual([[c4, c8, c10, c11], [c3, c7, c9], [c2, c6], [c1]]);

  result = reduceOwnershipCards(
    [[c1], [c1, c2, c6, c3, c7, c9, c4, c8, c10, c11], [c1, c2, c6], [c1, c2, c6, c3, c7, c9]],
    [1, 4, 2, 3]
  );

  expect(result).toStrictEqual([[c1], [c4, c8, c10, c11], [c2, c6], [c3, c7, c9]]);

  result = reduceOwnershipCards([[c1], [c2], [c1, c2, c3, c4], [c5, c6]], [1, 1, 2, 2]);

  expect(result).toStrictEqual([[c1], [c2], [c3, c4], [c5, c6]]);

  result = reduceOwnershipCards([[c1, c2, c5], [c2, c3], [c2, c4], [c5]], [2, 1, 1, 1]);
  expect(result).toStrictEqual([[c1, c2], [c3], [c4], [c5]]);
});
