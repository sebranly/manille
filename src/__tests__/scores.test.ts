import { compareCardRanks, getRankPoints, getCardsPoints, getScore } from '../scores';
import { generateDeck, generateSuit } from '../cards';
import { CardRank, CardSuit } from '../types';
import { getPreviousRank } from '../scores';

const { Ace, Eight, Jack, King, Nine, Queen, Seven, Ten } = CardRank;
const { Clubs, Diamonds, Hearts, Spades } = CardSuit;
const deck = generateDeck();

test('getRankPoints', () => {
  expect(getRankPoints(Ten)).toBe(5);
  expect(getRankPoints(Ace)).toBe(4);
  expect(getRankPoints(King)).toBe(3);
  expect(getRankPoints(Queen)).toBe(2);
  expect(getRankPoints(Jack)).toBe(1);
  expect(getRankPoints(Nine)).toBe(0);
  expect(getRankPoints(Eight)).toBe(0);
  expect(getRankPoints(Seven)).toBe(0);
});

test('getPreviousRank', () => {
  expect(getPreviousRank(Ten)).toBe(Ace);
  expect(getPreviousRank(Ace)).toBe(King);
  expect(getPreviousRank(King)).toBe(Queen);
  expect(getPreviousRank(Queen)).toBe(Jack);
  expect(getPreviousRank(Jack)).toBe(Nine);
  expect(getPreviousRank(Nine)).toBe(Eight);
  expect(getPreviousRank(Eight)).toBe(Seven);
  expect(getPreviousRank(Seven)).toBeUndefined();
});

test('getCardsPoints', () => {
  const cardsSuit = generateSuit(Spades);
  expect(getCardsPoints(cardsSuit)).toBe(15);
  expect(getCardsPoints(deck)).toBe(60);

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

  expect(getCardsPoints(cards)).toBe(17);
});

test('getScore', () => {
  expect(getScore(deck)).toBe(30);
  expect(getScore(deck, 2)).toBe(60);
  expect(getScore(deck, 4)).toBe(120);
  expect(getScore(deck, 8)).toBe(240);

  const cardsSuit1 = generateSuit(Spades);
  expect(getScore(cardsSuit1)).toBe(0);
  expect(getScore(cardsSuit1, 2)).toBe(0);
  expect(getScore(cardsSuit1, 4)).toBe(0);
  expect(getScore(cardsSuit1, 8)).toBe(0);

  const cardsSuit2 = generateSuit(Hearts);
  const cardsTwoSuits = [...cardsSuit1, ...cardsSuit2];
  expect(getScore(cardsTwoSuits)).toBe(0);
  expect(getScore(cardsTwoSuits, 2)).toBe(0);
  expect(getScore(cardsTwoSuits, 4)).toBe(0);
  expect(getScore(cardsTwoSuits, 8)).toBe(0);

  const cardsSuit3 = generateSuit(Diamonds);
  const cardsThreeSuits = [...cardsTwoSuits, ...cardsSuit3];
  expect(getScore(cardsThreeSuits)).toBe(15);
  expect(getScore(cardsThreeSuits, 2)).toBe(30);
  expect(getScore(cardsThreeSuits, 4)).toBe(60);
  expect(getScore(cardsThreeSuits, 8)).toBe(120);
});

test('compareCardRanks', () => {
  // Output is 1
  expect(compareCardRanks(Ten, Ace)).toBe(1);
  expect(compareCardRanks(Ace, King)).toBe(1);
  expect(compareCardRanks(King, Queen)).toBe(1);
  expect(compareCardRanks(Queen, Jack)).toBe(1);
  expect(compareCardRanks(Jack, Nine)).toBe(1);
  expect(compareCardRanks(Nine, Eight)).toBe(1);
  expect(compareCardRanks(Eight, Seven)).toBe(1);

  expect(compareCardRanks(Ten, Ace)).toBe(1);
  expect(compareCardRanks(Ten, King)).toBe(1);
  expect(compareCardRanks(Ten, Queen)).toBe(1);
  expect(compareCardRanks(Ten, Jack)).toBe(1);
  expect(compareCardRanks(Ten, Nine)).toBe(1);
  expect(compareCardRanks(Ten, Eight)).toBe(1);
  expect(compareCardRanks(Ten, Seven)).toBe(1);

  // Output is 0
  expect(compareCardRanks(Ten, Ten)).toBe(0);
  expect(compareCardRanks(Ace, Ace)).toBe(0);
  expect(compareCardRanks(King, King)).toBe(0);
  expect(compareCardRanks(Queen, Queen)).toBe(0);
  expect(compareCardRanks(Jack, Jack)).toBe(0);
  expect(compareCardRanks(Nine, Nine)).toBe(0);
  expect(compareCardRanks(Eight, Eight)).toBe(0);
  expect(compareCardRanks(Seven, Seven)).toBe(0);

  // Output is -1
  expect(compareCardRanks(Ace, Ten)).toBe(-1);
  expect(compareCardRanks(King, Ace)).toBe(-1);
  expect(compareCardRanks(Queen, King)).toBe(-1);
  expect(compareCardRanks(Jack, Queen)).toBe(-1);
  expect(compareCardRanks(Nine, Jack)).toBe(-1);
  expect(compareCardRanks(Eight, Nine)).toBe(-1);
  expect(compareCardRanks(Seven, Eight)).toBe(-1);

  expect(compareCardRanks(Seven, Ten)).toBe(-1);
  expect(compareCardRanks(Seven, Ace)).toBe(-1);
  expect(compareCardRanks(Seven, King)).toBe(-1);
  expect(compareCardRanks(Seven, Queen)).toBe(-1);
  expect(compareCardRanks(Seven, Jack)).toBe(-1);
  expect(compareCardRanks(Seven, Nine)).toBe(-1);
  expect(compareCardRanks(Seven, Eight)).toBe(-1);
});
