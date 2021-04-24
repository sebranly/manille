import { generateSuit } from '../cards';
import { CardSuit } from '../types';
import { compareValues, flattenArray } from '../utils';

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
