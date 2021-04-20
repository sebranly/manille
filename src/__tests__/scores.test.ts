import { getCardPoints } from '../scores';
import { CardRank } from '../types';

const { Ace, Eight, Jack, King, Nine, Queen, Seven, Ten } = CardRank;

test('getCardPoints', () => {
  expect(getCardPoints(Ten)).toBe(5);
  expect(getCardPoints(Ace)).toBe(4);
  expect(getCardPoints(King)).toBe(3);
  expect(getCardPoints(Queen)).toBe(2);
  expect(getCardPoints(Jack)).toBe(1);
  expect(getCardPoints(Nine)).toBe(0);
  expect(getCardPoints(Eight)).toBe(0);
  expect(getCardPoints(Seven)).toBe(0);
});
