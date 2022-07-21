import { compareCardRanks } from './scores';
import { Card, CardSuit, PlayerId } from './types';
import { NUMBER_PLAYERS } from './constants';
import { isSameTeam } from '.';
import { filterBySuit, getCardIndex, sortSuit } from './cards';

export const getPlayableCards = (
  cards: Card[],
  playedCards: Card[],
  currentPlayerId: PlayerId,
  startingPlayerId: PlayerId,
  trumpSuit: CardSuit | false
) => {
  const isPlayerStarting = playedCards.length === 0 || currentPlayerId === startingPlayerId;
  const hasOneCard = cards.length <= 1;
  const canPlayAll = isPlayerStarting || hasOneCard;

  if (canPlayAll) return cards;

  // TODO: create a function for it
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
  currentPlayerId: PlayerId,
  startingPlayerId: PlayerId,
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

export const getLeaderIdSuit = (playedCards: Card[], startingPlayerId: PlayerId, suit: CardSuit | false) => {
  const highestPlayedCardTrump = getHighestPlayedCardSuit(playedCards, suit);

  const arrayId = getCardIndex(playedCards, highestPlayedCardTrump);

  const leaderId = getPlayerId(startingPlayerId, arrayId);

  return leaderId;
};

export const isTeammateLeading = (
  playedCards: Card[],
  currentPlayerId: PlayerId,
  startingPlayerId: PlayerId,
  suit: CardSuit | false
) => {
  const leaderId = getLeaderIdSuit(playedCards, startingPlayerId, suit);

  return isSameTeam(currentPlayerId, leaderId);
};

export const getLeaderFold = (playedCards: Card[], startingPlayerId: PlayerId, trumpSuit: CardSuit | false) => {
  if (playedCards.length !== NUMBER_PLAYERS) return -1;

  const isTrumpSuit = trumpSuit === false || playedCards[0].suit === trumpSuit;

  if (isTrumpSuit) {
    const suit = playedCards[0].suit;
    const leaderId = getLeaderIdSuit(playedCards, startingPlayerId, suit);

    return leaderId;
  }

  const requestedSuit = playedCards[0].suit;
  const playedCardsTrumpSuit = filterBySuit(playedCards, trumpSuit);

  if (playedCardsTrumpSuit.length === 0) {
    const leaderId = getLeaderIdSuit(playedCards, startingPlayerId, requestedSuit);

    return leaderId;
  }

  const leaderId = getLeaderIdSuit(playedCards, startingPlayerId, trumpSuit);

  return leaderId;
};

export const getPlayerId = (playerId: PlayerId, arrayId: number) => {
  return ((playerId + arrayId) % NUMBER_PLAYERS) as PlayerId;
};
