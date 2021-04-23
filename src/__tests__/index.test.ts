import { isSameTeam } from '../index';

test('isSameTeam', () => {
  expect(isSameTeam(0, 1)).toBe(false);
  expect(isSameTeam(0, 2)).toBe(true);
  expect(isSameTeam(0, 3)).toBe(false);

  expect(isSameTeam(1, 2)).toBe(false);
  expect(isSameTeam(1, 3)).toBe(true);

  expect(isSameTeam(2, 3)).toBe(false);
});
