import { generateDeck, generateSuit } from '../cards';
import {
  initializeInfoCards,
  updateInfoCards,
  updateInfoCardsBasic,
  updateInfoSuitHighest,
  initializeInfoSuitHighest
} from '../ia';
import { CardRank, CardSuit, InfoSuitHighest } from '../types';

const { Ace, Eight, Jack, King, Nine, Queen, Seven, Ten } = CardRank;
const { Clubs, Diamonds, Hearts, Spades } = CardSuit;

test('initializeInfoCards', () => {
  expect(initializeInfoCards([], 2)).toStrictEqual([generateDeck(), generateDeck(), [], generateDeck()]);

  const suit = generateSuit(Spades);
  const otherSuits = [...generateSuit(Clubs), ...generateSuit(Diamonds), ...generateSuit(Hearts)];

  expect(initializeInfoCards(suit, 2)).toStrictEqual([otherSuits, otherSuits, suit, otherSuits]);
});

test('initializeInfoSuitHighest', () => {
  const initialElement = {
    clubs: Ten,
    diamonds: Ten,
    hearts: Ten,
    spades: Ten
  };

  expect(initializeInfoSuitHighest()).toStrictEqual([initialElement, initialElement, initialElement, initialElement]);
});

test('updateInfoSuitHighest', () => {
  const info1 = updateInfoSuitHighest(initializeInfoSuitHighest(), [], 0, Diamonds);

  expect(info1).toStrictEqual(initializeInfoSuitHighest());

  const info2 = updateInfoSuitHighest(initializeInfoSuitHighest(), [{ rank: King, suit: Spades }], 0, Diamonds);

  expect(info2).toStrictEqual(initializeInfoSuitHighest());

  // No deductions can be made yet

  const info3 = updateInfoSuitHighest(
    initializeInfoSuitHighest(),
    [
      { rank: King, suit: Spades },
      { rank: Ten, suit: Spades }
    ],
    0,
    Diamonds
  );

  expect(info3).toStrictEqual(initializeInfoSuitHighest());

  const info4 = updateInfoSuitHighest(
    initializeInfoSuitHighest(),
    [
      { rank: King, suit: Spades },
      { rank: Ten, suit: Spades },
      { rank: Ace, suit: Spades }
    ],
    0,
    Diamonds
  );

  expect(info4).toStrictEqual(initializeInfoSuitHighest());

  const info5 = updateInfoSuitHighest(
    initializeInfoSuitHighest(),
    [
      { rank: King, suit: Spades },
      { rank: Ten, suit: Spades },
      { rank: Ace, suit: Spades },
      { rank: Seven, suit: Spades }
    ],
    0,
    Diamonds
  );

  expect(info5).toStrictEqual(initializeInfoSuitHighest());

  // Deductions are made based on suits

  const info6 = updateInfoSuitHighest(
    initializeInfoSuitHighest(),
    [
      { rank: King, suit: Spades },
      { rank: Seven, suit: Diamonds },
      { rank: Eight, suit: Diamonds },
      { rank: Nine, suit: Diamonds }
    ],
    0,
    Diamonds
  );

  expect(info6).toStrictEqual([
    {
      clubs: Ten,
      diamonds: Ten,
      hearts: Ten,
      spades: Ten
    },
    {
      clubs: Ten,
      diamonds: Ten,
      hearts: Ten,
      spades: undefined
    },
    {
      clubs: Ten,
      diamonds: Ten,
      hearts: Ten,
      spades: undefined
    },
    {
      clubs: Ten,
      diamonds: Ten,
      hearts: Ten,
      spades: undefined
    }
  ]);

  // Deductions are made based on suits and existing deductions are not overriden

  const info7 = updateInfoSuitHighest(
    [
      {
        clubs: undefined,
        diamonds: undefined,
        hearts: Ten,
        spades: Ten
      },
      {
        clubs: Ten,
        diamonds: Ten,
        hearts: Ten,
        spades: undefined
      },
      {
        clubs: Ten,
        diamonds: Ten,
        hearts: Ten,
        spades: Ten
      },
      {
        clubs: undefined,
        diamonds: Ten,
        hearts: Ten,
        spades: Ten
      }
    ],
    [
      { rank: King, suit: Spades },
      { rank: Seven, suit: Diamonds },
      { rank: Eight, suit: Diamonds },
      { rank: Nine, suit: Diamonds }
    ],
    0,
    Diamonds
  );

  expect(info7).toStrictEqual([
    {
      clubs: undefined,
      diamonds: undefined,
      hearts: Ten,
      spades: Ten
    },
    {
      clubs: Ten,
      diamonds: Ten,
      hearts: Ten,
      spades: undefined
    },
    {
      clubs: Ten,
      diamonds: Ten,
      hearts: Ten,
      spades: undefined
    },
    {
      clubs: undefined,
      diamonds: Ten,
      hearts: Ten,
      spades: undefined
    }
  ]);
});

test('updateInfoCardsBasic', () => {
  const deck = generateDeck();

  const infoCards = [deck, deck, [], deck];
  const infoSuitHighest: InfoSuitHighest[] = [
    {
      clubs: Ten,
      diamonds: undefined,
      hearts: Ten,
      spades: Ten
    },
    {
      clubs: undefined,
      diamonds: Ten,
      hearts: undefined,
      spades: undefined
    },
    {
      clubs: Ten,
      diamonds: Ten,
      hearts: Ten,
      spades: Ten
    },
    {
      clubs: undefined,
      diamonds: undefined,
      hearts: Ten,
      spades: Ten
    }
  ];

  expect(updateInfoCardsBasic(infoSuitHighest, infoCards, 2)).toStrictEqual([
    [...generateSuit(Clubs), ...generateSuit(Spades), ...generateSuit(Hearts)],
    generateSuit(Diamonds),
    [],
    [...generateSuit(Spades), ...generateSuit(Hearts)]
  ]);
});

// TODO: this is not really representative of the full functionality from this util
test('updateInfoCards', () => {
  const deck = generateDeck();

  const infoCards = [deck, deck, [], deck];
  const infoSuitHighest: InfoSuitHighest[] = [
    {
      clubs: Ten,
      diamonds: undefined,
      hearts: Ten,
      spades: Ten
    },
    {
      clubs: undefined,
      diamonds: Ten,
      hearts: undefined,
      spades: undefined
    },
    {
      clubs: Ten,
      diamonds: Ten,
      hearts: Ten,
      spades: Ten
    },
    {
      clubs: undefined,
      diamonds: undefined,
      hearts: Ten,
      spades: Ten
    }
  ];

  expect(updateInfoCards(infoSuitHighest, infoCards, [], 2, [1, 1, 1, 1])).toStrictEqual([
    [...generateSuit(Clubs), ...generateSuit(Spades), ...generateSuit(Hearts)],
    generateSuit(Diamonds),
    [],
    [...generateSuit(Spades), ...generateSuit(Hearts)]
  ]);
});
