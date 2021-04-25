import { generateDeck, generateSuit } from '../cards';
import {
  initializeKnowledgePanel,
  initializeKnowledgeCards,
  updateKnowledgePanelCardsBasic,
  updateKnowledgePanelSuits
} from '../ia';
import { CardRank, CardSuit, KnowledgeSuit } from '../types';

const { Ace, Eight, Jack, King, Nine, Queen, Seven, Ten } = CardRank;
const { Clubs, Diamonds, Hearts, Spades } = CardSuit;

test('initializeKnowledgeCards', () => {
  expect(initializeKnowledgeCards([], 2)).toStrictEqual([generateDeck(), generateDeck(), [], generateDeck()]);

  const suit = generateSuit(Spades);
  const otherSuits = [...generateSuit(Clubs), ...generateSuit(Diamonds), ...generateSuit(Hearts)];

  expect(initializeKnowledgeCards(suit, 2)).toStrictEqual([otherSuits, otherSuits, suit, otherSuits]);
});

test('initializeKnowledgePanel', () => {
  expect(initializeKnowledgePanel()).toStrictEqual([
    {
      hasClubs: true,
      hasDiamonds: true,
      hasHearts: true,
      hasSpades: true
    },
    {
      hasClubs: true,
      hasDiamonds: true,
      hasHearts: true,
      hasSpades: true
    },
    {
      hasClubs: true,
      hasDiamonds: true,
      hasHearts: true,
      hasSpades: true
    },
    {
      hasClubs: true,
      hasDiamonds: true,
      hasHearts: true,
      hasSpades: true
    }
  ]);
});

test('updateKnowledgePanelSuits', () => {
  const kp1 = updateKnowledgePanelSuits(initializeKnowledgePanel(), [], 0);

  expect(kp1).toStrictEqual(initializeKnowledgePanel());

  const kp2 = updateKnowledgePanelSuits(initializeKnowledgePanel(), [{ rank: King, suit: Spades }], 0);

  expect(kp2).toStrictEqual(initializeKnowledgePanel());

  // No deductions can be made yet

  const kp3 = updateKnowledgePanelSuits(
    initializeKnowledgePanel(),
    [
      { rank: King, suit: Spades },
      { rank: Ten, suit: Spades }
    ],
    0
  );

  expect(kp3).toStrictEqual(initializeKnowledgePanel());

  const kp4 = updateKnowledgePanelSuits(
    initializeKnowledgePanel(),
    [
      { rank: King, suit: Spades },
      { rank: Ten, suit: Spades },
      { rank: Ace, suit: Spades }
    ],
    0
  );

  expect(kp4).toStrictEqual(initializeKnowledgePanel());

  const kp5 = updateKnowledgePanelSuits(
    initializeKnowledgePanel(),
    [
      { rank: King, suit: Spades },
      { rank: Ten, suit: Spades },
      { rank: Ace, suit: Spades },
      { rank: Seven, suit: Spades }
    ],
    0
  );

  expect(kp5).toStrictEqual(initializeKnowledgePanel());

  // Deductions are made based on suits

  const kp6 = updateKnowledgePanelSuits(
    initializeKnowledgePanel(),
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
      hasClubs: true,
      hasDiamonds: true,
      hasHearts: true,
      hasSpades: true
    },
    {
      hasClubs: true,
      hasDiamonds: true,
      hasHearts: true,
      hasSpades: false
    },
    {
      hasClubs: true,
      hasDiamonds: true,
      hasHearts: true,
      hasSpades: false
    },
    {
      hasClubs: true,
      hasDiamonds: true,
      hasHearts: true,
      hasSpades: false
    }
  ]);

  // Deductions are made based on suits and existing deductions are not overriden

  const kp7 = updateKnowledgePanelSuits(
    [
      {
        hasClubs: false,
        hasDiamonds: false,
        hasHearts: true,
        hasSpades: true
      },
      {
        hasClubs: true,
        hasDiamonds: true,
        hasHearts: true,
        hasSpades: false
      },
      {
        hasClubs: true,
        hasDiamonds: true,
        hasHearts: true,
        hasSpades: true
      },
      {
        hasClubs: false,
        hasDiamonds: true,
        hasHearts: true,
        hasSpades: true
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
      hasClubs: false,
      hasDiamonds: false,
      hasHearts: true,
      hasSpades: true
    },
    {
      hasClubs: true,
      hasDiamonds: true,
      hasHearts: true,
      hasSpades: false
    },
    {
      hasClubs: true,
      hasDiamonds: true,
      hasHearts: true,
      hasSpades: false
    },
    {
      hasClubs: false,
      hasDiamonds: true,
      hasHearts: true,
      hasSpades: false
    }
  ]);
});

test('updateKnowledgePanelCardsBasic', () => {
  const deck = generateDeck();

  const knowledgeCards = [deck, deck, [], deck];
  const knowledgeSuits: KnowledgeSuit[] = [
    {
      hasClubs: true,
      hasDiamonds: false,
      hasHearts: true,
      hasSpades: true
    },
    {
      hasClubs: false,
      hasDiamonds: true,
      hasHearts: false,
      hasSpades: false
    },
    {
      hasClubs: true,
      hasDiamonds: true,
      hasHearts: true,
      hasSpades: true
    },
    {
      hasClubs: false,
      hasDiamonds: false,
      hasHearts: true,
      hasSpades: true
    }
  ];

  expect(updateKnowledgePanelCardsBasic(knowledgeSuits, knowledgeCards, 2)).toStrictEqual([
    [...generateSuit(Clubs), ...generateSuit(Spades), ...generateSuit(Hearts)],
    generateSuit(Diamonds),
    [],
    [...generateSuit(Spades), ...generateSuit(Hearts)]
  ]);
});
