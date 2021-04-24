import { compareCardRanks } from './scores';
import { Card, CardRank, CardSuit } from './types';
import { findIndex } from 'lodash';
import { NUMBER_PLAYERS } from './constants';
import { isSameTeam } from '.';

export const getPlayableCards = (
  cards: Card[],
  playedCards: Card[],
  currentPlayerId: number,
  startingPlayerId: number,
  trumpSuit: CardSuit | false
) => {
  const isPlayerStarting = playedCards.length === 0 || currentPlayerId === startingPlayerId;
  const hasOneCard = cards.length <= 1;
  const canPlayAll = isPlayerStarting || hasOneCard;

  if (canPlayAll) return cards;

  const isTrumpSuit = trumpSuit === false || playedCards[0].suit === trumpSuit;

  if (isTrumpSuit) {
    const playableCards = getPlayableCardsTrumpSuit(cards, playedCards);

    return playableCards;
  }

  const playableCards = getPlayableCardsNonTrumpSuit(cards, playedCards, currentPlayerId, startingPlayerId, trumpSuit);

  return playableCards;
};

export const getPlayableCardsTrumpSuit = (cards: Card[], playedCards: Card[]) => {
  const playedTrumpSuit = playedCards[0].suit;

  // TODO: create a function for it
  const cardsTrump = cards.filter((card: Card) => card.suit === playedTrumpSuit);

  if (cardsTrump.length === 0) return cards;
  if (cardsTrump.length === 1) return cardsTrump;

  // TODO: create function for it
  const playedCardsTrump = playedCards.filter((card: Card) => card.suit === playedTrumpSuit);
  const sortedPlayedCardsTrump = playedCardsTrump.sort((a, b) => -1 * compareCardRanks(a.rank, b.rank));
  const highestPlayedCardTrump = sortedPlayedCardsTrump[0];
  const { Ten } = CardRank;

  if (highestPlayedCardTrump.rank === Ten) return cardsTrump;

  const higherCardsTrump = cardsTrump.filter(
    (card: Card) => compareCardRanks(card.rank, highestPlayedCardTrump.rank) === 1
  );

  if (higherCardsTrump.length === 0) return cardsTrump;

  return higherCardsTrump;
};

export const getPlayableCardsNonTrumpSuit = (
  cards: Card[],
  playedCards: Card[],
  currentPlayerId: number,
  startingPlayerId: number,
  trumpSuit: CardSuit | false
) => {
  const requestedSuit = playedCards[0].suit;
  const cardsSuit = cards.filter((card: Card) => card.suit === requestedSuit);

  // If player has the suit, player has to provide
  if (cardsSuit.length > 0) return cardsSuit;

  const cardsTrump = cards.filter((card: Card) => card.suit === trumpSuit);

  // If player does not have the suit and has no cards from the trump suit, they can play any (meaningless) card
  if (!cardsTrump.length) return cards;

  // If player does not have the suit but can trump, and plays right after first opponent, they have to "trump" ("couper")
  if (playedCards.length === 1) return cardsTrump;

  // At this point, player cannot provide but has some cards from trump suit. We determine if using those cards is an obligation.
  const playedCardsTrump = playedCards.filter((card: Card) => card.suit === trumpSuit);

  if (playedCardsTrump.length === 0) {
    const playedCardsSuit = playedCards.filter((card: Card) => card.suit === requestedSuit);
    const sortedPlayedCardsSuit = playedCardsSuit.sort((a, b) => -1 * compareCardRanks(a.rank, b.rank));
    const highestPlayedCardSuit = sortedPlayedCardsSuit[0];

    const arrayId = findIndex(
      playedCards,
      (card: Card) => card.rank === highestPlayedCardSuit.rank && card.suit === highestPlayedCardSuit.suit
    );

    // TODO: create function for it
    const leaderId = (startingPlayerId + arrayId) % NUMBER_PLAYERS;

    if (isSameTeam(currentPlayerId, leaderId)) return cards;

    return cardsTrump;
  }

  // TODO: write unit tests from here
  const sortedPlayedCardsTrump = playedCardsTrump.sort((a, b) => -1 * compareCardRanks(a.rank, b.rank));
  const highestPlayedCardTrump = sortedPlayedCardsTrump[0];

  const arrayId = findIndex(
    playedCards,
    (card: Card) => card.rank === highestPlayedCardTrump.rank && card.suit === highestPlayedCardTrump.suit
  );

  // TODO: create function for it
  const leaderId = (startingPlayerId + arrayId) % NUMBER_PLAYERS;

  if (isSameTeam(currentPlayerId, leaderId)) return cards;

  const higherCardsTrump = cardsTrump.filter(
    (card: Card) => compareCardRanks(card.rank, highestPlayedCardTrump.rank) === 1
  );

  if (higherCardsTrump.length === 0) return cards;

  return higherCardsTrump;
};
