import { generateDeck, generateSuit } from '../cards';
import {
  initializeKnowledgeCards,
  updateKnowledgeCards,
  updateKnowledgeCardsBasic,
  updateKnowledgePresence,
  initializeKnowledgeHighest
} from '../ia';
import { CardRank, CardSuit, KnowledgeHighest } from '../types';

const { Ace, Eight, Jack, King, Nine, Queen, Seven, Ten } = CardRank;
const { Clubs, Diamonds, Hearts, Spades } = CardSuit;

test('initializeKnowledgeCards', () => {
  expect(initializeKnowledgeCards([], 2)).toStrictEqual([generateDeck(), generateDeck(), [], generateDeck()]);

  const suit = generateSuit(Spades);
  const otherSuits = [...generateSuit(Clubs), ...generateSuit(Diamonds), ...generateSuit(Hearts)];

  expect(initializeKnowledgeCards(suit, 2)).toStrictEqual([otherSuits, otherSuits, suit, otherSuits]);
});

test('initializeKnowledgeHighest', () => {
  const initialElement = {
    clubs: Ten,
    diamonds: Ten,
    hearts: Ten,
    spades: Ten
  };

  expect(initializeKnowledgeHighest()).toStrictEqual([initialElement, initialElement, initialElement, initialElement]);
});

test('updateKnowledgePresence', () => {
  const kp1 = updateKnowledgePresence(initializeKnowledgeHighest(), [], 0);

  expect(kp1).toStrictEqual(initializeKnowledgeHighest());

  const kp2 = updateKnowledgePresence(initializeKnowledgeHighest(), [{ rank: King, suit: Spades }], 0);

  expect(kp2).toStrictEqual(initializeKnowledgeHighest());

  // No deductions can be made yet

  const kp3 = updateKnowledgePresence(
    initializeKnowledgeHighest(),
    [
      { rank: King, suit: Spades },
      { rank: Ten, suit: Spades }
    ],
    0
  );

  expect(kp3).toStrictEqual(initializeKnowledgeHighest());

  const kp4 = updateKnowledgePresence(
    initializeKnowledgeHighest(),
    [
      { rank: King, suit: Spades },
      { rank: Ten, suit: Spades },
      { rank: Ace, suit: Spades }
    ],
    0
  );

  expect(kp4).toStrictEqual(initializeKnowledgeHighest());

  const kp5 = updateKnowledgePresence(
    initializeKnowledgeHighest(),
    [
      { rank: King, suit: Spades },
      { rank: Ten, suit: Spades },
      { rank: Ace, suit: Spades },
      { rank: Seven, suit: Spades }
    ],
    0
  );

  expect(kp5).toStrictEqual(initializeKnowledgeHighest());

  // Deductions are made based on suits

  const kp6 = updateKnowledgePresence(
    initializeKnowledgeHighest(),
    [
      { rank: King, suit: Spades },
      { rank: Seven, suit: Diamonds },
      { rank: Eight, suit: Diamonds },
      { rank: Nine, suit: Diamonds }
    ],
    0
  );

  expect(kp6).toStrictEqual([
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

  const kp7 = updateKnowledgePresence(
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
    0
  );

  expect(kp7).toStrictEqual([
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

test('updateKnowledgeCardsBasic', () => {
  const deck = generateDeck();

  const knowledgeCards = [deck, deck, [], deck];
  const knowledgePresence: KnowledgeHighest[] = [
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

  expect(updateKnowledgeCardsBasic(knowledgePresence, knowledgeCards, 2)).toStrictEqual([
    [...generateSuit(Clubs), ...generateSuit(Spades), ...generateSuit(Hearts)],
    generateSuit(Diamonds),
    [],
    [...generateSuit(Spades), ...generateSuit(Hearts)]
  ]);
});

// TODO: this is not really representative of the full functionality from this util
test('updateKnowledgeCards', () => {
  const deck = generateDeck();

  const knowledgeCards = [deck, deck, [], deck];
  const knowledgePresence: KnowledgeHighest[] = [
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

  expect(updateKnowledgeCards(knowledgePresence, knowledgeCards, [], 2, [1, 1, 1, 1])).toStrictEqual([
    [...generateSuit(Clubs), ...generateSuit(Spades), ...generateSuit(Hearts)],
    generateSuit(Diamonds),
    [],
    [...generateSuit(Spades), ...generateSuit(Hearts)]
  ]);
});
