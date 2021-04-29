import { generateDeck, generateSuit } from '../cards';
import {
  initializeKnowledgePresence,
  initializeKnowledgeCards,
  updateKnowledgeCards,
  updateKnowledgeCardsBasic,
  updateKnowledgePresence,
  initializeKnowledgeHighest
} from '../ia';
import { CardRank, CardSuit, KnowledgePresence } from '../types';

const { Ace, Eight, Jack, King, Nine, Queen, Seven, Ten } = CardRank;
const { Clubs, Diamonds, Hearts, Spades } = CardSuit;

test('initializeKnowledgeCards', () => {
  expect(initializeKnowledgeCards([], 2)).toStrictEqual([generateDeck(), generateDeck(), [], generateDeck()]);

  const suit = generateSuit(Spades);
  const otherSuits = [...generateSuit(Clubs), ...generateSuit(Diamonds), ...generateSuit(Hearts)];

  expect(initializeKnowledgeCards(suit, 2)).toStrictEqual([otherSuits, otherSuits, suit, otherSuits]);
});

test('initializeKnowledgePresence', () => {
  const initialElement = {
    clubs: true,
    diamonds: true,
    hearts: true,
    spades: true
  };

  expect(initializeKnowledgePresence()).toStrictEqual([initialElement, initialElement, initialElement, initialElement]);
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
  const kp1 = updateKnowledgePresence(initializeKnowledgePresence(), [], 0);

  expect(kp1).toStrictEqual(initializeKnowledgePresence());

  const kp2 = updateKnowledgePresence(initializeKnowledgePresence(), [{ rank: King, suit: Spades }], 0);

  expect(kp2).toStrictEqual(initializeKnowledgePresence());

  // No deductions can be made yet

  const kp3 = updateKnowledgePresence(
    initializeKnowledgePresence(),
    [
      { rank: King, suit: Spades },
      { rank: Ten, suit: Spades }
    ],
    0
  );

  expect(kp3).toStrictEqual(initializeKnowledgePresence());

  const kp4 = updateKnowledgePresence(
    initializeKnowledgePresence(),
    [
      { rank: King, suit: Spades },
      { rank: Ten, suit: Spades },
      { rank: Ace, suit: Spades }
    ],
    0
  );

  expect(kp4).toStrictEqual(initializeKnowledgePresence());

  const kp5 = updateKnowledgePresence(
    initializeKnowledgePresence(),
    [
      { rank: King, suit: Spades },
      { rank: Ten, suit: Spades },
      { rank: Ace, suit: Spades },
      { rank: Seven, suit: Spades }
    ],
    0
  );

  expect(kp5).toStrictEqual(initializeKnowledgePresence());

  // Deductions are made based on suits

  const kp6 = updateKnowledgePresence(
    initializeKnowledgePresence(),
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
      clubs: true,
      diamonds: true,
      hearts: true,
      spades: true
    },
    {
      clubs: true,
      diamonds: true,
      hearts: true,
      spades: false
    },
    {
      clubs: true,
      diamonds: true,
      hearts: true,
      spades: false
    },
    {
      clubs: true,
      diamonds: true,
      hearts: true,
      spades: false
    }
  ]);

  // Deductions are made based on suits and existing deductions are not overriden

  const kp7 = updateKnowledgePresence(
    [
      {
        clubs: false,
        diamonds: false,
        hearts: true,
        spades: true
      },
      {
        clubs: true,
        diamonds: true,
        hearts: true,
        spades: false
      },
      {
        clubs: true,
        diamonds: true,
        hearts: true,
        spades: true
      },
      {
        clubs: false,
        diamonds: true,
        hearts: true,
        spades: true
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
      clubs: false,
      diamonds: false,
      hearts: true,
      spades: true
    },
    {
      clubs: true,
      diamonds: true,
      hearts: true,
      spades: false
    },
    {
      clubs: true,
      diamonds: true,
      hearts: true,
      spades: false
    },
    {
      clubs: false,
      diamonds: true,
      hearts: true,
      spades: false
    }
  ]);
});

test('updateKnowledgeCardsBasic', () => {
  const deck = generateDeck();

  const knowledgeCards = [deck, deck, [], deck];
  const KnowledgePresences: KnowledgePresence[] = [
    {
      clubs: true,
      diamonds: false,
      hearts: true,
      spades: true
    },
    {
      clubs: false,
      diamonds: true,
      hearts: false,
      spades: false
    },
    {
      clubs: true,
      diamonds: true,
      hearts: true,
      spades: true
    },
    {
      clubs: false,
      diamonds: false,
      hearts: true,
      spades: true
    }
  ];

  expect(updateKnowledgeCardsBasic(KnowledgePresences, knowledgeCards, 2)).toStrictEqual([
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
  const KnowledgePresences: KnowledgePresence[] = [
    {
      clubs: true,
      diamonds: false,
      hearts: true,
      spades: true
    },
    {
      clubs: false,
      diamonds: true,
      hearts: false,
      spades: false
    },
    {
      clubs: true,
      diamonds: true,
      hearts: true,
      spades: true
    },
    {
      clubs: false,
      diamonds: false,
      hearts: true,
      spades: true
    }
  ];

  expect(updateKnowledgeCards(KnowledgePresences, knowledgeCards, [], 2, [1, 1, 1, 1])).toStrictEqual([
    [...generateSuit(Clubs), ...generateSuit(Spades), ...generateSuit(Hearts)],
    generateSuit(Diamonds),
    [],
    [...generateSuit(Spades), ...generateSuit(Hearts)]
  ]);
});
