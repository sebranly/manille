import { generateDeck } from '../cards';
import { distributeCards, isSameTeam } from '../index';
import { Player } from '../types';

test('isSameTeam', () => {
  expect(isSameTeam(0, 0)).toBe(true);
  expect(isSameTeam(0, 1)).toBe(false);
  expect(isSameTeam(0, 2)).toBe(true);
  expect(isSameTeam(0, 3)).toBe(false);

  expect(isSameTeam(1, 0)).toBe(false);
  expect(isSameTeam(1, 1)).toBe(true);
  expect(isSameTeam(1, 2)).toBe(false);
  expect(isSameTeam(1, 3)).toBe(true);

  expect(isSameTeam(2, 0)).toBe(true);
  expect(isSameTeam(2, 1)).toBe(false);
  expect(isSameTeam(2, 2)).toBe(true);
  expect(isSameTeam(2, 3)).toBe(false);

  expect(isSameTeam(3, 0)).toBe(false);
  expect(isSameTeam(3, 1)).toBe(true);
  expect(isSameTeam(3, 2)).toBe(false);
  expect(isSameTeam(3, 3)).toBe(true);
});

test('distributeCards', () => {
  const players: Player[] = [
    { id: 0, cards: [], name: 'a' },
    { id: 1, cards: [], name: 'b' },
    { id: 2, cards: [], name: 'c' },
    { id: 3, cards: [], name: 'd' }
  ];

  distributeCards(generateDeck(), players);

  expect(players[0].cards).toHaveLength(8);
  expect(players[1].cards).toHaveLength(8);
  expect(players[2].cards).toHaveLength(8);
  expect(players[3].cards).toHaveLength(8);

  expect(players[0].cards).toMatchSnapshot('player 0');
  expect(players[1].cards).toMatchSnapshot('player 1');
  expect(players[2].cards).toMatchSnapshot('player 2');
  expect(players[3].cards).toMatchSnapshot('player 3');
});
