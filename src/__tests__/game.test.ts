import { generateDeck, generateSuit } from '../cards';
import { getWinnerIdTrick, getPlayableCards, getHigherCardsSuit, getHighestCardSuit, getPlayerId } from '../game';
import { CardRank, CardSuit } from '../types';

const { Ace, Eight, Jack, King, Nine, Queen, Seven, Ten } = CardRank;
const { Clubs, Diamonds, Hearts, Spades } = CardSuit;

const deck = generateDeck();
const suit = generateSuit(Clubs);

test('getHighestCardSuit', () => {
  expect(getHighestCardSuit(deck, false)).toBeUndefined();
  expect(getHighestCardSuit(deck, Clubs)).toStrictEqual({ rank: Ten, suit: Clubs });
  expect(getHighestCardSuit(suit, Clubs)).toStrictEqual({ rank: Ten, suit: Clubs });
  expect(getHighestCardSuit(suit, Diamonds)).toBeUndefined();

  expect(
    getHighestCardSuit(
      [
        { rank: Nine, suit: Clubs },
        { rank: Eight, suit: Clubs }
      ],
      Clubs
    )
  ).toStrictEqual({ rank: Nine, suit: Clubs });
});

test('getHigherCardsSuit', () => {
  expect(getHigherCardsSuit(deck, [], false)).toStrictEqual([]);
  expect(getHigherCardsSuit(deck, [], Clubs)).toStrictEqual(suit);

  expect(
    getHigherCardsSuit(
      deck,
      [
        { rank: Nine, suit: Clubs },
        { rank: King, suit: Clubs }
      ],
      Clubs
    )
  ).toStrictEqual([
    { rank: Ten, suit: Clubs },
    { rank: Ace, suit: Clubs }
  ]);

  expect(getHigherCardsSuit(suit, [], Clubs)).toStrictEqual(suit);
  expect(getHigherCardsSuit(suit, [], Diamonds)).toStrictEqual([]);
  expect(
    getHigherCardsSuit(
      [
        { rank: Nine, suit: Clubs },
        { rank: Eight, suit: Clubs }
      ],
      [],
      Clubs
    )
  ).toStrictEqual([
    { rank: Nine, suit: Clubs },
    { rank: Eight, suit: Clubs }
  ]);
});

test('getWinnerIdTrick', () => {
  // It returns -1 if no 4 played cards
  const id1 = getWinnerIdTrick([], 0, false);
  expect(id1).toBe(-1);

  const id2 = getWinnerIdTrick([], 0, Spades);
  expect(id2).toBe(-1);

  const id3 = getWinnerIdTrick([{ rank: Ten, suit: Spades }], 0, false);
  expect(id3).toBe(-1);

  const id4 = getWinnerIdTrick([{ rank: Ten, suit: Spades }], 0, Spades);
  expect(id4).toBe(-1);

  const id5 = getWinnerIdTrick(
    [
      { rank: Ten, suit: Spades },
      { rank: Ace, suit: Spades }
    ],
    0,
    false
  );

  expect(id5).toBe(-1);

  const id6 = getWinnerIdTrick(
    [
      { rank: Ten, suit: Spades },
      { rank: Ace, suit: Spades }
    ],
    0,
    Spades
  );

  expect(id6).toBe(-1);

  const id7 = getWinnerIdTrick(
    [
      { rank: Ten, suit: Spades },
      { rank: Ace, suit: Spades },
      { rank: King, suit: Spades }
    ],
    0,
    false
  );

  expect(id7).toBe(-1);

  const id8 = getWinnerIdTrick(
    [
      { rank: Ten, suit: Spades },
      { rank: Ace, suit: Spades },
      { rank: King, suit: Spades }
    ],
    0,
    Spades
  );

  expect(id8).toBe(-1);

  // Is "en voiture"
  const id9 = getWinnerIdTrick(
    [
      { rank: Ace, suit: Spades },
      { rank: Ten, suit: Spades },
      { rank: King, suit: Spades },
      { rank: Queen, suit: Spades }
    ],
    0,
    false
  );

  expect(id9).toBe(1);

  const id10 = getWinnerIdTrick(
    [
      { rank: Ace, suit: Spades },
      { rank: Ten, suit: Spades },
      { rank: King, suit: Diamonds },
      { rank: Queen, suit: Diamonds }
    ],
    0,
    false
  );

  expect(id10).toBe(1);

  // Is "atout"
  const id11 = getWinnerIdTrick(
    [
      { rank: Ace, suit: Spades },
      { rank: Ten, suit: Spades },
      { rank: King, suit: Spades },
      { rank: Queen, suit: Spades }
    ],
    0,
    Spades
  );

  expect(id11).toBe(1);

  const id12 = getWinnerIdTrick(
    [
      { rank: Ace, suit: Spades },
      { rank: Ten, suit: Spades },
      { rank: King, suit: Diamonds },
      { rank: Queen, suit: Diamonds }
    ],
    0,
    Spades
  );

  expect(id12).toBe(1);

  // Is not "atout" and there is no "atout" being played

  const id13 = getWinnerIdTrick(
    [
      { rank: Ace, suit: Spades },
      { rank: Ten, suit: Spades },
      { rank: King, suit: Spades },
      { rank: Queen, suit: Spades }
    ],
    0,
    Clubs
  );

  expect(id13).toBe(1);

  const id14 = getWinnerIdTrick(
    [
      { rank: Ace, suit: Spades },
      { rank: Ten, suit: Spades },
      { rank: King, suit: Diamonds },
      { rank: Queen, suit: Diamonds }
    ],
    0,
    Clubs
  );

  expect(id14).toBe(1);

  // It not "atout" but there are "atouts"

  const id15 = getWinnerIdTrick(
    [
      { rank: Ace, suit: Spades },
      { rank: King, suit: Spades },
      { rank: Ten, suit: Spades },
      { rank: Seven, suit: Clubs }
    ],
    0,
    Clubs
  );

  expect(id15).toBe(3);

  const id16 = getWinnerIdTrick(
    [
      { rank: Ten, suit: Spades },
      { rank: Seven, suit: Clubs },
      { rank: Eight, suit: Clubs },
      { rank: Jack, suit: Spades }
    ],
    0,
    Clubs
  );

  expect(id16).toBe(2);

  const id17 = getWinnerIdTrick(
    [
      { rank: Ten, suit: Spades },
      { rank: Seven, suit: Clubs },
      { rank: Eight, suit: Clubs },
      { rank: Jack, suit: Clubs }
    ],
    0,
    Clubs
  );

  expect(id17).toBe(3);

  // It works even when startingPlayerId is not 0

  const id18 = getWinnerIdTrick(
    [
      { rank: Ten, suit: Spades },
      { rank: Seven, suit: Clubs },
      { rank: Eight, suit: Clubs },
      { rank: Jack, suit: Spades }
    ],
    2,
    Clubs
  );

  expect(id18).toBe(0);

  const id19 = getWinnerIdTrick(
    [
      { rank: Ten, suit: Spades },
      { rank: Seven, suit: Clubs },
      { rank: Eight, suit: Clubs },
      { rank: Jack, suit: Clubs }
    ],
    2,
    Clubs
  );

  expect(id19).toBe(1);
});

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

  // It returns one card if player only has one card left
  const oneCard = [{ rank: Eight, suit: Diamonds }];
  const copyOneCard = [...oneCard];

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
  // Player 3 starts and leads with trump suit, player 0 plays next and has no suit
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

  // Player 1 starts and leads with trump suit, player 0 plays last and has no suit
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

  // Player 3 starts and leads with trump suit, player 0 plays next and has only one card from that suit
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

  // Player 1 starts and leads with trump suit, player 0 plays last and has only one card from that suit
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

  // Partner plays the ten of trump suit so player 0 can play any card from trump suit
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

  // Partner plays a middle card from trump suit so player 0 has to play any higher card from trump
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

  // Partner plays a middle card from trump suit and player 0 cannot go higher but has to provide trump suit
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

  // No-trump suit ("en voiture")

  // Player 3 starts and leads with trump suit, player 0 plays next and has no suit
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

  // Player 1 starts and leads with any suit ("en voiture"), player 0 plays last and has no suit
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

  // Player 3 starts and leads with any suit ("en voiture"), player 0 plays next and has only one card from that suit
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

  // Player 1 starts and leads with any suit ("en voiture"), player 0 plays last and has only one card from that suit
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

  // Opponent player plays the ten of any suit ("en voiture") so player 0 can play any card from that suit
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

  // Partner plays the ten of any suit ("en voiture") so player 0 can play any card from that suit
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

  // Opponent player plays a middle card from any suit ("en voiture") so player 0 has to play any higher card from that suit
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

  // Partner plays a middle card from any suit ("en voiture") so player 0 has to play any higher card from that suit
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

  // Opponent player plays a middle card from any suit ("en voiture") and player 0 cannot go higher but has to provide that suit
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

  // Partner plays a middle card from any suit ("en voiture") and player 0 cannot go higher but has to provide that suit
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

  // Not a trump suit at all (nor "en voiture")

  // Player 3 plays a non-trump suit and player 0 has to provide
  const c39 = getPlayableCards(
    [
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: Ten, suit: Spades },
      { rank: Queen, suit: Spades },
      { rank: Jack, suit: Spades },
      { rank: Eight, suit: Spades },
      { rank: Seven, suit: Spades },
      { rank: Ace, suit: Diamonds }
    ],
    [{ rank: Ace, suit: Spades }],
    0,
    3,
    Clubs
  );

  expect(c39).toStrictEqual([
    { rank: Ten, suit: Spades },
    { rank: Queen, suit: Spades },
    { rank: Jack, suit: Spades },
    { rank: Eight, suit: Spades },
    { rank: Seven, suit: Spades }
  ]);

  // Player 1 plays a non-trump suit and player 0 plays last and has to provide
  const c40 = getPlayableCards(
    [
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Clubs },
      { rank: Ten, suit: Spades },
      { rank: Queen, suit: Spades },
      { rank: Jack, suit: Spades },
      { rank: Eight, suit: Spades },
      { rank: Seven, suit: Spades },
      { rank: Ace, suit: Diamonds }
    ],
    [
      { rank: Ace, suit: Spades },
      { rank: King, suit: Spades },
      { rank: Nine, suit: Spades }
    ],
    0,
    1,
    Clubs
  );

  expect(c40).toStrictEqual([
    { rank: Ten, suit: Spades },
    { rank: Queen, suit: Spades },
    { rank: Jack, suit: Spades },
    { rank: Eight, suit: Spades },
    { rank: Seven, suit: Spades }
  ]);

  // Player 3 plays a non-trump suit and player 0 hasn't got any card from that suit nor from the trump suit
  const c41 = getPlayableCards(
    [
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: Ten, suit: Diamonds },
      { rank: Ace, suit: Diamonds },
      { rank: Queen, suit: Diamonds },
      { rank: Jack, suit: Diamonds },
      { rank: Eight, suit: Diamonds },
      { rank: Seven, suit: Diamonds }
    ],
    [{ rank: Ace, suit: Spades }],
    0,
    3,
    Clubs
  );

  expect(c41).toStrictEqual([
    { rank: Ten, suit: Hearts },
    { rank: Ace, suit: Hearts },
    { rank: Ten, suit: Diamonds },
    { rank: Ace, suit: Diamonds },
    { rank: Queen, suit: Diamonds },
    { rank: Jack, suit: Diamonds },
    { rank: Eight, suit: Diamonds },
    { rank: Seven, suit: Diamonds }
  ]);

  // Player 1 plays a non-trump suit and player 0 hasn't got any card from that suit nor from the trump suit
  const c42 = getPlayableCards(
    [
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: Ten, suit: Diamonds },
      { rank: Ace, suit: Diamonds },
      { rank: Queen, suit: Diamonds },
      { rank: Jack, suit: Diamonds },
      { rank: Eight, suit: Diamonds },
      { rank: Seven, suit: Diamonds }
    ],
    [
      { rank: Ace, suit: Spades },
      { rank: King, suit: Spades },
      { rank: Nine, suit: Spades }
    ],
    0,
    1,
    Clubs
  );

  expect(c42).toStrictEqual([
    { rank: Ten, suit: Hearts },
    { rank: Ace, suit: Hearts },
    { rank: Ten, suit: Diamonds },
    { rank: Ace, suit: Diamonds },
    { rank: Queen, suit: Diamonds },
    { rank: Jack, suit: Diamonds },
    { rank: Eight, suit: Diamonds },
    { rank: Seven, suit: Diamonds }
  ]);

  // Player 0 cannot provide but has some cards from the trump suit. Opponents lead (player 3) so player 0 has to trump
  const c43 = getPlayableCards(
    [
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: Ten, suit: Clubs },
      { rank: Ace, suit: Clubs },
      { rank: Queen, suit: Clubs },
      { rank: Jack, suit: Clubs },
      { rank: Eight, suit: Clubs },
      { rank: Seven, suit: Clubs }
    ],
    [{ rank: Ace, suit: Spades }],
    0,
    3,
    Clubs
  );

  expect(c43).toStrictEqual([
    { rank: Ten, suit: Clubs },
    { rank: Ace, suit: Clubs },
    { rank: Queen, suit: Clubs },
    { rank: Jack, suit: Clubs },
    { rank: Eight, suit: Clubs },
    { rank: Seven, suit: Clubs }
  ]);

  // Player 0 cannot provide but has some cards from the trump suit. Opponents lead (player 1) so player 0 has to trump
  const c44 = getPlayableCards(
    [
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: Ten, suit: Clubs },
      { rank: Ace, suit: Clubs },
      { rank: Queen, suit: Clubs },
      { rank: Jack, suit: Clubs },
      { rank: Eight, suit: Clubs },
      { rank: Seven, suit: Clubs }
    ],
    [
      { rank: Ten, suit: Spades },
      { rank: Queen, suit: Spades },
      { rank: Ace, suit: Spades }
    ],
    0,
    1,
    Clubs
  );

  expect(c44).toStrictEqual([
    { rank: Ten, suit: Clubs },
    { rank: Ace, suit: Clubs },
    { rank: Queen, suit: Clubs },
    { rank: Jack, suit: Clubs },
    { rank: Eight, suit: Clubs },
    { rank: Seven, suit: Clubs }
  ]);

  // Player 0 cannot provide but has some cards from the trump suit. Opponents don't lead so player 0 does not have to trump
  const c45 = getPlayableCards(
    [
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: Ten, suit: Clubs },
      { rank: Ace, suit: Clubs },
      { rank: Queen, suit: Clubs },
      { rank: Jack, suit: Clubs },
      { rank: Eight, suit: Clubs },
      { rank: Seven, suit: Clubs }
    ],
    [
      { rank: Ace, suit: Spades },
      { rank: Ten, suit: Spades },
      { rank: Queen, suit: Spades }
    ],
    0,
    1,
    Clubs
  );

  expect(c45).toStrictEqual([
    { rank: Ten, suit: Hearts },
    { rank: Ace, suit: Hearts },
    { rank: Ten, suit: Clubs },
    { rank: Ace, suit: Clubs },
    { rank: Queen, suit: Clubs },
    { rank: Jack, suit: Clubs },
    { rank: Eight, suit: Clubs },
    { rank: Seven, suit: Clubs }
  ]);

  // Player 0 cannot provide but has some cards from the trump suit. Opponents don't lead (player 2 trumped) so player 0 does not have to trump
  const c46 = getPlayableCards(
    [
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: Ten, suit: Clubs },
      { rank: Ace, suit: Clubs },
      { rank: Queen, suit: Clubs },
      { rank: Jack, suit: Clubs },
      { rank: Eight, suit: Clubs },
      { rank: Seven, suit: Clubs }
    ],
    [
      { rank: Ace, suit: Spades },
      { rank: Ten, suit: Clubs },
      { rank: Queen, suit: Spades }
    ],
    0,
    1,
    Clubs
  );

  expect(c46).toStrictEqual([
    { rank: Ten, suit: Hearts },
    { rank: Ace, suit: Hearts },
    { rank: Ten, suit: Clubs },
    { rank: Ace, suit: Clubs },
    { rank: Queen, suit: Clubs },
    { rank: Jack, suit: Clubs },
    { rank: Eight, suit: Clubs },
    { rank: Seven, suit: Clubs }
  ]);

  // Player 0 cannot provide but has some cards from the trump suit. Opponents lead (player 3 trumped) so player 0 has to trump over
  const c47 = getPlayableCards(
    [
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: Ten, suit: Clubs },
      { rank: Ace, suit: Clubs },
      { rank: King, suit: Clubs },
      { rank: Jack, suit: Clubs },
      { rank: Eight, suit: Clubs },
      { rank: Seven, suit: Clubs }
    ],
    [
      { rank: Ace, suit: Spades },
      { rank: Ten, suit: Spades },
      { rank: Queen, suit: Clubs }
    ],
    0,
    1,
    Clubs
  );

  expect(c47).toStrictEqual([
    { rank: Ten, suit: Clubs },
    { rank: Ace, suit: Clubs },
    { rank: King, suit: Clubs }
  ]);

  // Player 0 cannot provide but has some cards from the trump suit. Opponents lead (player 3 trumped) but player 0 cannot trump over
  const c48 = getPlayableCards(
    [
      { rank: Ten, suit: Hearts },
      { rank: Ace, suit: Hearts },
      { rank: Ten, suit: Diamonds },
      { rank: King, suit: Clubs },
      { rank: Queen, suit: Clubs },
      { rank: Jack, suit: Clubs },
      { rank: Eight, suit: Clubs },
      { rank: Seven, suit: Clubs }
    ],
    [
      { rank: Ace, suit: Spades },
      { rank: Ten, suit: Spades },
      { rank: Ace, suit: Clubs }
    ],
    0,
    1,
    Clubs
  );

  expect(c48).toStrictEqual([
    { rank: Ten, suit: Hearts },
    { rank: Ace, suit: Hearts },
    { rank: Ten, suit: Diamonds },
    { rank: King, suit: Clubs },
    { rank: Queen, suit: Clubs },
    { rank: Jack, suit: Clubs },
    { rank: Eight, suit: Clubs },
    { rank: Seven, suit: Clubs }
  ]);
});

test('getPlayerId', () => {
  expect(getPlayerId(0, 0)).toBe(0);
  expect(getPlayerId(0, 1)).toBe(1);
  expect(getPlayerId(0, 2)).toBe(2);
  expect(getPlayerId(0, 3)).toBe(3);

  expect(getPlayerId(1, 0)).toBe(1);
  expect(getPlayerId(1, 1)).toBe(2);
  expect(getPlayerId(1, 2)).toBe(3);
  expect(getPlayerId(1, 3)).toBe(0);
});
