import { generateDeck } from '../cards';
import { dealCards, arePartners } from '../index';
import { Player } from '../types';

test('arePartners', () => {
  expect(arePartners(0, 0)).toBe(true);
  expect(arePartners(0, 1)).toBe(false);
  expect(arePartners(0, 2)).toBe(true);
  expect(arePartners(0, 3)).toBe(false);

  expect(arePartners(1, 0)).toBe(false);
  expect(arePartners(1, 1)).toBe(true);
  expect(arePartners(1, 2)).toBe(false);
  expect(arePartners(1, 3)).toBe(true);

  expect(arePartners(2, 0)).toBe(true);
  expect(arePartners(2, 1)).toBe(false);
  expect(arePartners(2, 2)).toBe(true);
  expect(arePartners(2, 3)).toBe(false);

  expect(arePartners(3, 0)).toBe(false);
  expect(arePartners(3, 1)).toBe(true);
  expect(arePartners(3, 2)).toBe(false);
  expect(arePartners(3, 3)).toBe(true);
});

test('dealCards', () => {
  const players: Player[] = [
    { id: 0, cards: [], name: 'a' },
    { id: 1, cards: [], name: 'b' },
    { id: 2, cards: [], name: 'c' },
    { id: 3, cards: [], name: 'd' }
  ];

  dealCards(generateDeck(), players);

  expect(players[0].cards).toHaveLength(8);
  expect(players[1].cards).toHaveLength(8);
  expect(players[2].cards).toHaveLength(8);
  expect(players[3].cards).toHaveLength(8);

  expect(players[0].cards).toMatchSnapshot('player 0');
  expect(players[1].cards).toMatchSnapshot('player 1');
  expect(players[2].cards).toMatchSnapshot('player 2');
  expect(players[3].cards).toMatchSnapshot('player 3');
});
