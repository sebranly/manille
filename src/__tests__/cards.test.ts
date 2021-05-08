import {
  cutDeck,
  excludeCards,
  excludeSuit,
  excludeSuitOver,
  filterBySuit,
  generateDeck,
  generateSuit,
  hasCard,
  orderCards,
  sortSuit
} from '../cards';
import { CardRank, CardSuit } from '../types';

const { Ace, Eight, Jack, King, Nine, Queen, Seven, Ten } = CardRank;
const { Clubs, Diamonds, Hearts, Spades } = CardSuit;

test('generateSuit', () => {
  expect(generateSuit(Hearts)).toStrictEqual([
    { rank: Ten, suit: Hearts },
    { rank: Ace, suit: Hearts },
    { rank: King, suit: Hearts },
    { rank: Queen, suit: Hearts },
    { rank: Jack, suit: Hearts },
    { rank: Nine, suit: Hearts },
    { rank: Eight, suit: Hearts },
    { rank: Seven, suit: Hearts }
  ]);
});

test('generateDeck', () => {
  const deck = generateDeck();
  expect(deck).toMatchSnapshot();
  expect(deck).toHaveLength(32);
});

test('cutDeck', () => {
  const deck1 = cutDeck(generateDeck(), -1);
  const deck2 = cutDeck(generateDeck(), 0);
  const deck3 = cutDeck(generateDeck(), 16);
  const deck4 = cutDeck(generateDeck(), 32);
  const deck5 = cutDeck(generateDeck(), 33);

  expect(deck1).toHaveLength(32);
  expect(deck1).toStrictEqual(deck2);
  expect(deck2).toStrictEqual(deck3);
  expect(deck3).toStrictEqual(deck4);
  expect(deck4).toStrictEqual(deck5);

  const deck6 = cutDeck(generateDeck(), 10);

  expect(deck6).toMatchSnapshot();
  expect(deck6).toHaveLength(32);
});

test('orderCards', () => {
  const cardsSuit = generateSuit(Spades);
  const copyCardsSuit = [...cardsSuit];

  expect(orderCards(cardsSuit)).toStrictEqual(copyCardsSuit);

  const cardsDeck = generateDeck();
  const copyCardsDeck = [...cardsDeck];

  expect(orderCards(cardsDeck)).toStrictEqual(copyCardsDeck);

  // TODO: should I create a mock?
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

  expect(orderCards(cards)).toStrictEqual([
    { rank: King, suit: Clubs },
    { rank: Nine, suit: Clubs },
    { rank: Eight, suit: Diamonds },
    { rank: Seven, suit: Diamonds },
    { rank: Ten, suit: Spades },
    { rank: Ace, suit: Spades },
    { rank: Jack, suit: Spades },
    { rank: Ace, suit: Hearts }
  ]);
});

test('filterBySuit', () => {
  expect(filterBySuit([], Clubs)).toStrictEqual([]);
  expect(filterBySuit([], false)).toStrictEqual([]);

  const suit1 = generateSuit(Diamonds);
  expect(filterBySuit(suit1, Clubs)).toStrictEqual([]);

  const suit2 = generateSuit(Clubs);
  expect(filterBySuit(suit2, Clubs)).toStrictEqual([
    { rank: Ten, suit: Clubs },
    { rank: Ace, suit: Clubs },
    { rank: King, suit: Clubs },
    { rank: Queen, suit: Clubs },
    { rank: Jack, suit: Clubs },
    { rank: Nine, suit: Clubs },
    { rank: Eight, suit: Clubs },
    { rank: Seven, suit: Clubs }
  ]);

  const deck = generateDeck();
  expect(filterBySuit(deck, Clubs)).toStrictEqual([
    { rank: Ten, suit: Clubs },
    { rank: Ace, suit: Clubs },
    { rank: King, suit: Clubs },
    { rank: Queen, suit: Clubs },
    { rank: Jack, suit: Clubs },
    { rank: Nine, suit: Clubs },
    { rank: Eight, suit: Clubs },
    { rank: Seven, suit: Clubs }
  ]);

  expect(filterBySuit(deck, false)).toStrictEqual([]);
});

test('excludeSuit', () => {
  expect(excludeSuit([], Clubs)).toStrictEqual([]);

  const suit1 = generateSuit(Clubs);
  expect(excludeSuit(suit1, Diamonds)).toStrictEqual([
    { rank: Ten, suit: Clubs },
    { rank: Ace, suit: Clubs },
    { rank: King, suit: Clubs },
    { rank: Queen, suit: Clubs },
    { rank: Jack, suit: Clubs },
    { rank: Nine, suit: Clubs },
    { rank: Eight, suit: Clubs },
    { rank: Seven, suit: Clubs }
  ]);

  const suit2 = generateSuit(Clubs);
  expect(excludeSuit(suit2, Clubs)).toStrictEqual([]);

  const deck = generateDeck();
  const result = excludeSuit(deck, Clubs);
  expect(result).toHaveLength(24);
  expect(result).toMatchSnapshot();
});

test('excludeSuitOver', () => {
  expect(excludeSuitOver([], Clubs, Seven)).toStrictEqual([]);

  const suit1 = generateSuit(Clubs);
  expect(excludeSuitOver(suit1, Diamonds, Seven)).toStrictEqual([
    { rank: Ten, suit: Clubs },
    { rank: Ace, suit: Clubs },
    { rank: King, suit: Clubs },
    { rank: Queen, suit: Clubs },
    { rank: Jack, suit: Clubs },
    { rank: Nine, suit: Clubs },
    { rank: Eight, suit: Clubs },
    { rank: Seven, suit: Clubs }
  ]);

  const suit2 = generateSuit(Clubs);
  expect(excludeSuitOver(suit2, Clubs, Seven)).toStrictEqual([{ rank: Seven, suit: Clubs }]);
  expect(excludeSuitOver(suit2, Clubs, Ten)).toStrictEqual([
    { rank: Ten, suit: Clubs },
    { rank: Ace, suit: Clubs },
    { rank: King, suit: Clubs },
    { rank: Queen, suit: Clubs },
    { rank: Jack, suit: Clubs },
    { rank: Nine, suit: Clubs },
    { rank: Eight, suit: Clubs },
    { rank: Seven, suit: Clubs }
  ]);

  const deck = generateDeck();
  const result = excludeSuitOver(deck, Clubs, Nine);
  expect(result).toHaveLength(27);
  expect(result).toMatchSnapshot();
});

test('sortSuit', () => {
  const suit = generateSuit(Clubs);

  expect(sortSuit(suit)).toStrictEqual([
    { rank: Ten, suit: Clubs },
    { rank: Ace, suit: Clubs },
    { rank: King, suit: Clubs },
    { rank: Queen, suit: Clubs },
    { rank: Jack, suit: Clubs },
    { rank: Nine, suit: Clubs },
    { rank: Eight, suit: Clubs },
    { rank: Seven, suit: Clubs }
  ]);

  const unsortedSuit = [
    { rank: Eight, suit: Clubs },
    { rank: Ace, suit: Clubs },
    { rank: Queen, suit: Clubs },
    { rank: King, suit: Clubs },
    { rank: Jack, suit: Clubs },
    { rank: Ten, suit: Clubs },
    { rank: Seven, suit: Clubs },
    { rank: Nine, suit: Clubs }
  ];

  expect(sortSuit(unsortedSuit)).toStrictEqual([
    { rank: Ten, suit: Clubs },
    { rank: Ace, suit: Clubs },
    { rank: King, suit: Clubs },
    { rank: Queen, suit: Clubs },
    { rank: Jack, suit: Clubs },
    { rank: Nine, suit: Clubs },
    { rank: Eight, suit: Clubs },
    { rank: Seven, suit: Clubs }
  ]);
});

test('excludeCards', () => {
  const deck = generateDeck();

  expect(excludeCards([], [])).toStrictEqual([]);
  expect(excludeCards([], deck)).toStrictEqual([]);
  expect(excludeCards(deck, [])).toStrictEqual(generateDeck());
  expect(excludeCards(deck, deck)).toStrictEqual([]);

  const result = excludeCards(
    [
      { rank: King, suit: Spades },
      { rank: King, suit: Hearts },
      { rank: Queen, suit: Spades },
      { rank: Queen, suit: Hearts }
    ],
    [
      { rank: King, suit: Spades },
      { rank: Queen, suit: Hearts }
    ]
  );

  expect(result).toStrictEqual([
    { rank: King, suit: Hearts },
    { rank: Queen, suit: Spades }
  ]);
});

test('hasCard', () => {
  const deck = generateDeck();
  const suit1 = generateSuit(Clubs);
  const suit2 = generateSuit(Diamonds);
  const card = { rank: King, suit: Diamonds };
  const otherCard = { rank: Queen, suit: Diamonds };

  expect(hasCard([], card)).toBe(false);
  expect(hasCard(suit1, card)).toBe(false);
  expect(hasCard([otherCard], card)).toBe(false);

  expect(hasCard(deck, card)).toBe(true);
  expect(hasCard(suit2, card)).toBe(true);
  expect(hasCard([...suit1, ...suit2], card)).toBe(true);
  expect(hasCard([card], card)).toBe(true);
  expect(hasCard([card, otherCard], card)).toBe(true);
});
