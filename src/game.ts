import { compareCardRanks } from './scores';
import { Card, CardSuit } from './types';
import { findIndex } from 'lodash';
import { NUMBER_PLAYERS } from './constants';
import { isSameTeam } from '.';
import { filterBySuit, sortSuit } from './cards';

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

export const getHighestPlayedCardSuit = (playedCards: Card[], suit: CardSuit | false) => {
  const playedCardsSuit = filterBySuit(playedCards, suit);
  const sortedPlayedCardsSuit = sortSuit(playedCardsSuit);
  const highestPlayedCardSuit = sortedPlayedCardsSuit[0];

  return highestPlayedCardSuit;
};

export const getHigherCardsSuit = (cards: Card[], playedCards: Card[], suit: CardSuit | false) => {
  const cardsSuit = filterBySuit(cards, suit);
  const highestPlayedCardSuit = getHighestPlayedCardSuit(playedCards, suit);

  const higherCardsSuit = cardsSuit.filter(
    (card: Card) => compareCardRanks(card.rank, highestPlayedCardSuit.rank) === 1
  );

  return higherCardsSuit;
};

export const getPlayableCardsTrumpSuit = (cards: Card[], playedCards: Card[]) => {
  const playedTrumpSuit = playedCards[0].suit;

  const cardsTrump = filterBySuit(cards, playedTrumpSuit);

  if (cardsTrump.length === 0) return cards;
  if (cardsTrump.length === 1) return cardsTrump;

  const higherCardsTrump = getHigherCardsSuit(cards, playedCards, playedTrumpSuit);

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
  const cardsSuit = filterBySuit(cards, requestedSuit);

  // If player has the suit, player has to provide
  if (cardsSuit.length > 0) return cardsSuit;

  const cardsTrump = filterBySuit(cards, trumpSuit);

  // If player does not have the suit and has no cards from the trump suit, they can play any (meaningless) card
  if (!cardsTrump.length) return cards;

  // If player does not have the suit but can trump, and plays right after first opponent, they have to "trump" ("couper")
  if (playedCards.length === 1) return cardsTrump;

  // At this point, player cannot provide but has some cards from trump suit.
  // We determine if using those cards is an obligation.
  const playedCardsTrump = filterBySuit(playedCards, trumpSuit);

  if (playedCardsTrump.length === 0) {
    const isLeading = isTeammateLeading(playedCards, currentPlayerId, startingPlayerId, requestedSuit);
    if (isLeading) return cards;

    return cardsTrump;
  }

  const isLeading = isTeammateLeading(playedCards, currentPlayerId, startingPlayerId, trumpSuit);
  if (isLeading) return cards;

  const higherCardsTrump = getHigherCardsSuit(cards, playedCards, trumpSuit);

  if (higherCardsTrump.length === 0) return cards;

  return higherCardsTrump;
};

export const isTeammateLeading = (
  playedCards: Card[],
  currentPlayerId: number,
  startingPlayerId: number,
  suit: CardSuit | false
) => {
  const highestPlayedCardTrump = getHighestPlayedCardSuit(playedCards, suit);

  const arrayId = findIndex(
    playedCards,
    (card: Card) => card.rank === highestPlayedCardTrump.rank && card.suit === highestPlayedCardTrump.suit
  );

  const leaderId = (startingPlayerId + arrayId) % NUMBER_PLAYERS;

  return isSameTeam(currentPlayerId, leaderId);
};
