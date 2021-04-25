import { generateSuit } from '../cards';
import { CardSuit } from '../types';
import { compareValues, flattenArray, getSureValues, getSureValuesWithLength } from '../utils';

const { Clubs, Diamonds, Hearts, Spades } = CardSuit;

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
  expect(getSureValues([[1], [2], [3], [4]])).toStrictEqual([[1], [2], [3], [4]]);
  expect(
    getSureValues([
      [1, 11],
      [2, 12],
      [3, 13],
      [4, 14, 40]
    ])
  ).toStrictEqual([
    [1, 11],
    [2, 12],
    [3, 13],
    [4, 14, 40]
  ]);

  expect(
    getSureValues([
      [1, 2, 3, 4],
      [1, 2, 3, 4],
      [3, 1, 2, 4],
      [4, 4, 4, 2, 1, 3]
    ])
  ).toStrictEqual([[], [], [], []]);

  expect(getSureValues([[1, 2, 3, 4], [1], [3], [2]])).toStrictEqual([[4], [], [], []]);
});

test('getSureValuesWithLength', () => {
  expect(getSureValuesWithLength([[]], [1])).toStrictEqual([[]]);
  expect(getSureValuesWithLength([[], []], [1, 1])).toStrictEqual([[], []]);
  expect(getSureValuesWithLength([[1], [2], [3], [4]], [1, 1, 1, 1])).toStrictEqual([[1], [2], [3], [4]]);
  expect(
    getSureValuesWithLength(
      [
        [1, 11],
        [2, 12],
        [3, 13],
        [4, 14, 40]
      ],
      [2, 2, 2, 3]
    )
  ).toStrictEqual([
    [1, 11],
    [2, 12],
    [3, 13],
    [4, 14, 40]
  ]);
});
