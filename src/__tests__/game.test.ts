import { getPlayableCards, getPlayableCardsTrumpSuit } from '../game';
import { CardRank, CardSuit } from '../types';

const { Ace, Eight, Jack, King, Nine, Queen, Seven, Ten } = CardRank;
const { Clubs, Diamonds, Hearts, Spades } = CardSuit;

test('getPlayableCards', () => {
  // It returns empty if empty ~ no played cards
  const c1 = getPlayableCards([], [], 0, 0, false);
  expect(c1).toStrictEqual([]);

  const c2 = getPlayableCards([], [], 0, 1, false);
  expect(c2).toStrictEqual([]);

  const c3 = getPlayableCards([], [], 0, 2, false);
  expect(c3).toStrictEqual([]);

  const c4 = getPlayableCards([], [], 0, 0, Spades);
  expect(c4).toStrictEqual([]);

  const c5 = getPlayableCards([], [], 0, 1, Spades);
  expect(c5).toStrictEqual([]);

  const c6 = getPlayableCards([], [], 0, 2, Spades);
  expect(c6).toStrictEqual([]);

  // It returns empty if empty ~ some played cards
  const c7 = getPlayableCards(
    [],
    [
      { rank: Ace, suit: Diamonds },
      { rank: King, suit: Diamonds },
      { rank: Jack, suit: Diamonds }
    ],
    0,
    1,
    false
  );

  expect(c7).toStrictEqual([]);

  const c8 = getPlayableCards(
    [],
    [
      { rank: King, suit: Diamonds },
      { rank: Jack, suit: Diamonds }
    ],
    0,
    2,
    false
  );

  expect(c8).toStrictEqual([]);

  const c9 = getPlayableCards(
    [],
    [
      { rank: Ace, suit: Diamonds },
      { rank: King, suit: Diamonds },
      { rank: Jack, suit: Diamonds }
    ],
    0,
    1,
    Spades
  );

  expect(c9).toStrictEqual([]);

  const c10 = getPlayableCards(
    [],
    [
      { rank: King, suit: Diamonds },
      { rank: Jack, suit: Diamonds }
    ],
    0,
    2,
    Spades
  );

  expect(c10).toStrictEqual([]);

  // It returns all cards if player starts
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

  const copyCards = [...cards];

  const c11 = getPlayableCards(cards, [], 0, 0, false);
  expect(c11).toStrictEqual(copyCards);
  expect(c11).toHaveLength(8);

  const c12 = getPlayableCards(cards, [], 0, 0, Diamonds);
  expect(c12).toStrictEqual(copyCards);
  expect(c12).toHaveLength(8);

  const c13 = getPlayableCards(cards, [], 1, 1, false);
  expect(c13).toStrictEqual(copyCards);
  expect(c13).toHaveLength(8);

  const c14 = getPlayableCards(cards, [], 1, 1, Diamonds);
  expect(c14).toStrictEqual(copyCards);
  expect(c14).toHaveLength(8);

  const oneCard = [{ rank: Eight, suit: Diamonds }];
  const copyOneCard = [...oneCard];

  // It returns one card if player only have one card left
  const c15 = getPlayableCards(
    oneCard,
    [
      { rank: Ace, suit: Diamonds },
      { rank: King, suit: Diamonds },
      { rank: Jack, suit: Diamonds }
    ],
    0,
    1,
    false
  );

  expect(c15).toStrictEqual(copyOneCard);

  const c16 = getPlayableCards(
    oneCard,
    [
      { rank: King, suit: Diamonds },
      { rank: Jack, suit: Diamonds }
    ],
    0,
    2,
    false
  );

  expect(c16).toStrictEqual(copyOneCard);

  const c17 = getPlayableCards(
    oneCard,
    [
      { rank: Ace, suit: Diamonds },
      { rank: King, suit: Diamonds },
      { rank: Jack, suit: Diamonds }
    ],
    0,
    1,
    Spades
  );

  expect(c17).toStrictEqual(copyOneCard);

  const c18 = getPlayableCards(
    oneCard,
    [
      { rank: King, suit: Diamonds },
      { rank: Jack, suit: Diamonds }
    ],
    0,
    2,
    Spades
  );

  expect(c18).toStrictEqual(copyOneCard);

  // Trump suit
  // Player 3 starts and requests trump suit, player 0 plays next and has no suit
  const c19 = getPlayableCards(
    [
      { rank: King, suit: Clubs },
      { rank: Nine, suit: Clubs },
      { rank: Eight, suit: Diamonds },
      { rank: Seven, suit: Diamonds },
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: Jack, suit: Hearts },
      { rank: Ace, suit: Hearts }
    ],
    [{ rank: King, suit: Spades }],
    0,
    3,
    Spades
  );

  expect(c19).toStrictEqual([
    { rank: King, suit: Clubs },
    { rank: Nine, suit: Clubs },
    { rank: Eight, suit: Diamonds },
    { rank: Seven, suit: Diamonds },
    { rank: Ten, suit: Hearts },
    { rank: Ace, suit: Hearts },
    { rank: Jack, suit: Hearts },
    { rank: Ace, suit: Hearts }
  ]);

  // Player 1 starts and requests trump suit, player 0 plays last and has no suit
  const c20 = getPlayableCards(
    [
      { rank: King, suit: Clubs },
      { rank: Nine, suit: Clubs },
      { rank: Eight, suit: Diamonds },
      { rank: Seven, suit: Diamonds },
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: Jack, suit: Hearts },
      { rank: Ace, suit: Hearts }
    ],
    [
      { rank: King, suit: Spades },
      { rank: Queen, suit: Spades },
      { rank: Jack, suit: Spades }
    ],
    0,
    1,
    Spades
  );

  expect(c20).toStrictEqual([
    { rank: King, suit: Clubs },
    { rank: Nine, suit: Clubs },
    { rank: Eight, suit: Diamonds },
    { rank: Seven, suit: Diamonds },
    { rank: Ten, suit: Hearts },
    { rank: Ace, suit: Hearts },
    { rank: Jack, suit: Hearts },
    { rank: Ace, suit: Hearts }
  ]);

  // Player 3 starts and requests trump suit, player 0 plays next and has only one card from that suit
  const c21 = getPlayableCards(
    [
      { rank: King, suit: Clubs },
      { rank: Nine, suit: Clubs },
      { rank: Eight, suit: Diamonds },
      { rank: Seven, suit: Diamonds },
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: Jack, suit: Hearts },
      { rank: Jack, suit: Spades }
    ],
    [{ rank: King, suit: Spades }],
    0,
    3,
    Spades
  );

  expect(c21).toStrictEqual([{ rank: Jack, suit: Spades }]);

  // Player 1 starts and requests trump suit, player 0 plays last and has only one card from that suit
  const c22 = getPlayableCards(
    [
      { rank: King, suit: Clubs },
      { rank: Nine, suit: Clubs },
      { rank: Eight, suit: Diamonds },
      { rank: Seven, suit: Diamonds },
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: Jack, suit: Hearts },
      { rank: Jack, suit: Spades }
    ],
    [
      { rank: King, suit: Spades },
      { rank: Queen, suit: Spades },
      { rank: Seven, suit: Spades }
    ],
    0,
    1,
    Spades
  );

  expect(c22).toStrictEqual([{ rank: Jack, suit: Spades }]);

  // Opponent player plays the ten of trump suit so player 0 can play any card from trump suit
  const c23 = getPlayableCards(
    [
      { rank: Ace, suit: Spades },
      { rank: King, suit: Spades },
      { rank: Queen, suit: Spades },
      { rank: Jack, suit: Spades },
      { rank: Nine, suit: Spades },
      { rank: Eight, suit: Spades },
      { rank: Seven, suit: Spades },
      { rank: Ace, suit: Diamonds }
    ],
    [{ rank: Ten, suit: Spades }],
    0,
    3,
    Spades
  );

  expect(c23).toStrictEqual([
    { rank: Ace, suit: Spades },
    { rank: King, suit: Spades },
    { rank: Queen, suit: Spades },
    { rank: Jack, suit: Spades },
    { rank: Nine, suit: Spades },
    { rank: Eight, suit: Spades },
    { rank: Seven, suit: Spades }
  ]);

  // Same team player plays the ten of trump suit so player 0 can play any card from trump suit
  const c24 = getPlayableCards(
    [
      { rank: Ace, suit: Spades },
      { rank: King, suit: Spades },
      { rank: Queen, suit: Spades },
      { rank: Jack, suit: Spades },
      { rank: Nine, suit: Spades },
      { rank: Eight, suit: Spades },
      { rank: Seven, suit: Spades },
      { rank: Ace, suit: Diamonds }
    ],
    [
      { rank: Ten, suit: Spades },
      { rank: Seven, suit: Diamonds }
    ],
    0,
    2,
    Spades
  );

  expect(c24).toStrictEqual([
    { rank: Ace, suit: Spades },
    { rank: King, suit: Spades },
    { rank: Queen, suit: Spades },
    { rank: Jack, suit: Spades },
    { rank: Nine, suit: Spades },
    { rank: Eight, suit: Spades },
    { rank: Seven, suit: Spades }
  ]);

  // Opponent player plays a middle card from trump suit so player 0 has to play any higher card from trump
  const c25 = getPlayableCards(
    [
      { rank: Ten, suit: Spades },
      { rank: Ace, suit: Spades },
      { rank: King, suit: Spades },
      { rank: Queen, suit: Spades },
      { rank: Jack, suit: Spades },
      { rank: Eight, suit: Spades },
      { rank: Seven, suit: Spades },
      { rank: Ace, suit: Diamonds }
    ],
    [{ rank: Nine, suit: Spades }],
    0,
    3,
    Spades
  );

  expect(c25).toStrictEqual([
    { rank: Ten, suit: Spades },
    { rank: Ace, suit: Spades },
    { rank: King, suit: Spades },
    { rank: Queen, suit: Spades },
    { rank: Jack, suit: Spades }
  ]);

  // Same team player plays a middle card from trump suit so player 0 has to play any higher card from trump
  const c26 = getPlayableCards(
    [
      { rank: Ten, suit: Spades },
      { rank: Ace, suit: Spades },
      { rank: King, suit: Spades },
      { rank: Queen, suit: Spades },
      { rank: Jack, suit: Spades },
      { rank: Eight, suit: Spades },
      { rank: Seven, suit: Spades },
      { rank: Ace, suit: Diamonds }
    ],
    [
      { rank: Nine, suit: Spades },
      { rank: Nine, suit: Diamonds }
    ],
    0,
    2,
    Spades
  );

  expect(c26).toStrictEqual([
    { rank: Ten, suit: Spades },
    { rank: Ace, suit: Spades },
    { rank: King, suit: Spades },
    { rank: Queen, suit: Spades },
    { rank: Jack, suit: Spades }
  ]);

  // Opponent player plays a middle card from trump suit and player 0 cannot go higher but has to provide trump suit
  const c27 = getPlayableCards(
    [
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: King, suit: Spades },
      { rank: Queen, suit: Spades },
      { rank: Jack, suit: Spades },
      { rank: Eight, suit: Spades },
      { rank: Seven, suit: Spades },
      { rank: Ace, suit: Diamonds }
    ],
    [{ rank: Ace, suit: Spades }],
    0,
    3,
    Spades
  );

  expect(c27).toStrictEqual([
    { rank: King, suit: Spades },
    { rank: Queen, suit: Spades },
    { rank: Jack, suit: Spades },
    { rank: Eight, suit: Spades },
    { rank: Seven, suit: Spades }
  ]);

  // Same team player plays a middle card from trump suit and player 0 cannot go higher but has to provide trump suit
  const c28 = getPlayableCards(
    [
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: King, suit: Spades },
      { rank: Queen, suit: Spades },
      { rank: Jack, suit: Spades },
      { rank: Eight, suit: Spades },
      { rank: Seven, suit: Spades },
      { rank: Ace, suit: Diamonds }
    ],
    [
      { rank: Ace, suit: Spades },
      { rank: Nine, suit: Diamonds }
    ],
    0,
    2,
    Spades
  );

  expect(c28).toStrictEqual([
    { rank: King, suit: Spades },
    { rank: Queen, suit: Spades },
    { rank: Jack, suit: Spades },
    { rank: Eight, suit: Spades },
    { rank: Seven, suit: Spades }
  ]);

  // No-trump suit
  // Player 3 starts and requests trump suit, player 0 plays next and has no suit
  const c29 = getPlayableCards(
    [
      { rank: King, suit: Clubs },
      { rank: Nine, suit: Clubs },
      { rank: Eight, suit: Diamonds },
      { rank: Seven, suit: Diamonds },
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: Jack, suit: Hearts },
      { rank: Ace, suit: Hearts }
    ],
    [{ rank: King, suit: Spades }],
    0,
    3,
    false
  );

  expect(c29).toStrictEqual([
    { rank: King, suit: Clubs },
    { rank: Nine, suit: Clubs },
    { rank: Eight, suit: Diamonds },
    { rank: Seven, suit: Diamonds },
    { rank: Ten, suit: Hearts },
    { rank: Ace, suit: Hearts },
    { rank: Jack, suit: Hearts },
    { rank: Ace, suit: Hearts }
  ]);

  // Player 1 starts and requests trump suit, player 0 plays last and has no suit
  const c30 = getPlayableCards(
    [
      { rank: King, suit: Clubs },
      { rank: Nine, suit: Clubs },
      { rank: Eight, suit: Diamonds },
      { rank: Seven, suit: Diamonds },
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: Jack, suit: Hearts },
      { rank: Ace, suit: Hearts }
    ],
    [
      { rank: King, suit: Spades },
      { rank: Queen, suit: Spades },
      { rank: Jack, suit: Spades }
    ],
    0,
    1,
    false
  );

  expect(c30).toStrictEqual([
    { rank: King, suit: Clubs },
    { rank: Nine, suit: Clubs },
    { rank: Eight, suit: Diamonds },
    { rank: Seven, suit: Diamonds },
    { rank: Ten, suit: Hearts },
    { rank: Ace, suit: Hearts },
    { rank: Jack, suit: Hearts },
    { rank: Ace, suit: Hearts }
  ]);

  // Player 3 starts and requests trump suit, player 0 plays next and has only one card from that suit
  const c31 = getPlayableCards(
    [
      { rank: King, suit: Clubs },
      { rank: Nine, suit: Clubs },
      { rank: Eight, suit: Diamonds },
      { rank: Seven, suit: Diamonds },
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: Jack, suit: Hearts },
      { rank: Jack, suit: Spades }
    ],
    [{ rank: King, suit: Spades }],
    0,
    3,
    false
  );

  expect(c31).toStrictEqual([{ rank: Jack, suit: Spades }]);

  // Player 1 starts and requests trump suit, player 0 plays last and has only one card from that suit
  const c32 = getPlayableCards(
    [
      { rank: King, suit: Clubs },
      { rank: Nine, suit: Clubs },
      { rank: Eight, suit: Diamonds },
      { rank: Seven, suit: Diamonds },
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: Jack, suit: Hearts },
      { rank: Jack, suit: Spades }
    ],
    [
      { rank: King, suit: Spades },
      { rank: Queen, suit: Spades },
      { rank: Seven, suit: Spades }
    ],
    0,
    1,
    false
  );

  expect(c32).toStrictEqual([{ rank: Jack, suit: Spades }]);

  // Opponent player plays the ten of trump suit so player 0 can play any card from trump suit
  const c33 = getPlayableCards(
    [
      { rank: Ace, suit: Spades },
      { rank: King, suit: Spades },
      { rank: Queen, suit: Spades },
      { rank: Jack, suit: Spades },
      { rank: Nine, suit: Spades },
      { rank: Eight, suit: Spades },
      { rank: Seven, suit: Spades },
      { rank: Ace, suit: Diamonds }
    ],
    [{ rank: Ten, suit: Spades }],
    0,
    3,
    false
  );

  expect(c33).toStrictEqual([
    { rank: Ace, suit: Spades },
    { rank: King, suit: Spades },
    { rank: Queen, suit: Spades },
    { rank: Jack, suit: Spades },
    { rank: Nine, suit: Spades },
    { rank: Eight, suit: Spades },
    { rank: Seven, suit: Spades }
  ]);

  // Same team player plays the ten of trump suit so player 0 can play any card from trump suit
  const c34 = getPlayableCards(
    [
      { rank: Ace, suit: Spades },
      { rank: King, suit: Spades },
      { rank: Queen, suit: Spades },
      { rank: Jack, suit: Spades },
      { rank: Nine, suit: Spades },
      { rank: Eight, suit: Spades },
      { rank: Seven, suit: Spades },
      { rank: Ace, suit: Diamonds }
    ],
    [
      { rank: Ten, suit: Spades },
      { rank: Seven, suit: Diamonds }
    ],
    0,
    2,
    false
  );

  expect(c34).toStrictEqual([
    { rank: Ace, suit: Spades },
    { rank: King, suit: Spades },
    { rank: Queen, suit: Spades },
    { rank: Jack, suit: Spades },
    { rank: Nine, suit: Spades },
    { rank: Eight, suit: Spades },
    { rank: Seven, suit: Spades }
  ]);

  // Opponent player plays a middle card from trump suit so player 0 has to play any higher card from trump
  const c35 = getPlayableCards(
    [
      { rank: Ten, suit: Spades },
      { rank: Ace, suit: Spades },
      { rank: King, suit: Spades },
      { rank: Queen, suit: Spades },
      { rank: Jack, suit: Spades },
      { rank: Eight, suit: Spades },
      { rank: Seven, suit: Spades },
      { rank: Ace, suit: Diamonds }
    ],
    [{ rank: Nine, suit: Spades }],
    0,
    3,
    false
  );

  expect(c35).toStrictEqual([
    { rank: Ten, suit: Spades },
    { rank: Ace, suit: Spades },
    { rank: King, suit: Spades },
    { rank: Queen, suit: Spades },
    { rank: Jack, suit: Spades }
  ]);

  // Same team player plays a middle card from trump suit so player 0 has to play any higher card from trump
  const c36 = getPlayableCards(
    [
      { rank: Ten, suit: Spades },
      { rank: Ace, suit: Spades },
      { rank: King, suit: Spades },
      { rank: Queen, suit: Spades },
      { rank: Jack, suit: Spades },
      { rank: Eight, suit: Spades },
      { rank: Seven, suit: Spades },
      { rank: Ace, suit: Diamonds }
    ],
    [
      { rank: Nine, suit: Spades },
      { rank: Nine, suit: Diamonds }
    ],
    0,
    2,
    false
  );

  expect(c36).toStrictEqual([
    { rank: Ten, suit: Spades },
    { rank: Ace, suit: Spades },
    { rank: King, suit: Spades },
    { rank: Queen, suit: Spades },
    { rank: Jack, suit: Spades }
  ]);

  // Opponent player plays a middle card from trump suit and player 0 cannot go higher but has to provide trump suit
  const c37 = getPlayableCards(
    [
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: King, suit: Spades },
      { rank: Queen, suit: Spades },
      { rank: Jack, suit: Spades },
      { rank: Eight, suit: Spades },
      { rank: Seven, suit: Spades },
      { rank: Ace, suit: Diamonds }
    ],
    [{ rank: Ace, suit: Spades }],
    0,
    3,
    false
  );

  expect(c37).toStrictEqual([
    { rank: King, suit: Spades },
    { rank: Queen, suit: Spades },
    { rank: Jack, suit: Spades },
    { rank: Eight, suit: Spades },
    { rank: Seven, suit: Spades }
  ]);

  // Same team player plays a middle card from trump suit and player 0 cannot go higher but has to provide trump suit
  const c38 = getPlayableCards(
    [
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: King, suit: Spades },
      { rank: Queen, suit: Spades },
      { rank: Jack, suit: Spades },
      { rank: Eight, suit: Spades },
      { rank: Seven, suit: Spades },
      { rank: Ace, suit: Diamonds }
    ],
    [
      { rank: Ace, suit: Spades },
      { rank: Nine, suit: Diamonds }
    ],
    0,
    2,
    false
  );

  expect(c38).toStrictEqual([
    { rank: King, suit: Spades },
    { rank: Queen, suit: Spades },
    { rank: Jack, suit: Spades },
    { rank: Eight, suit: Spades },
    { rank: Seven, suit: Spades }
  ]);
});
