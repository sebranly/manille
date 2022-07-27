import { compareCardRanks } from './scores';
import { Card, CardSuit, PlayerId } from './types';
import { NUMBER_PLAYERS } from './constants';
import { arePartners } from '.';
import { filterBySuit, getCardId, sortSuit } from './cards';

/**
 * @name getPlayableCards
 * @description Returns all playable cards for a player given several rules from Manille game
 */
export const getPlayableCards = (
  cards: Card[],
  playedCards: Card[],
  currentPlayerId: PlayerId,
  startingPlayerId: PlayerId,
  trumpSuit: CardSuit | false
) => {
  const isPlayerStarting = playedCards.length === 0 || currentPlayerId === startingPlayerId;
  const hasOneCard = cards.length <= 1;
  const canPlayAny = isPlayerStarting || hasOneCard;

  if (canPlayAny) return cards;

  // TODO: create a function for it
  const isTrumpSuit = trumpSuit === false || playedCards[0].suit === trumpSuit;

  if (isTrumpSuit) {
    const playableCards = getPlayableCardsTrumpSuit(cards, playedCards);

    return playableCards;
  }

  const playableCards = getPlayableCardsNonTrumpSuit(cards, playedCards, currentPlayerId, startingPlayerId, trumpSuit);

  return playableCards;
};

/**
 * @name getHighestCardSuit
 * @description Returns the from the same suit
 * @todo tests
 */
export const getHighestCardSuit = (cards: Card[], suit: CardSuit | false) => {
  const cardsSuit = filterBySuit(cards, suit);
  const sortedCardsSuit = sortSuit(cardsSuit);
  const highestCardSuit = sortedCardsSuit[0];

  return highestCardSuit;
};

/**
 * @name getHigherCardsSuit
 * @description Returns the cards from the same suit that are higher than the current highest
 * @todo tests
 */
export const getHigherCardsSuit = (cards: Card[], playedCards: Card[], suit: CardSuit | false) => {
  const cardsSuit = filterBySuit(cards, suit);
  const highestPlayedCardSuit = getHighestCardSuit(playedCards, suit);

  const higherCardsSuit = cardsSuit.filter(
    (card: Card) => compareCardRanks(card.rank, highestPlayedCardSuit.rank) === 1
  );

  return higherCardsSuit;
};

/**
 * @name getPlayableCardsTrumpSuit
 * @description Returns all playable cards for a player for a trump suit
 * @todo tests
 */
export const getPlayableCardsTrumpSuit = (cards: Card[], playedCards: Card[]) => {
  // First played card belongs to the trump suit
  const playedTrumpSuit = playedCards[0].suit;

  const cardsTrump = filterBySuit(cards, playedTrumpSuit);

  // If the player has no cards from the trump suit, they can play any
  if (cardsTrump.length === 0) return cards;

  // If the player has one card from the trump suit, they have to give it
  if (cardsTrump.length === 1) return cardsTrump;

  // At this point, the player has cards from the trump suit
  const higherCardsTrump = getHigherCardsSuit(cards, playedCards, playedTrumpSuit);

  // If the player has no cards higher from the played one (trump suit), they can provide any cards from the trump suit
  if (higherCardsTrump.length === 0) return cardsTrump;

  // If the player has at least one card from the trump suit that is higher than the played one, they have to play one of them
  return higherCardsTrump;
};

/**
 * @name getPlayableCardsNonTrumpSuit
 * @description Returns all playable cards for a player for a non-trump suit
 * @todo tests
 * @todo last three lines can be combined with function `getPlayableCardsTrumpSuit`
 * @todo trumpSuit is confusing here cause type should just be trumpSuit, it's not a condition
 */
export const getPlayableCardsNonTrumpSuit = (
  cards: Card[],
  playedCards: Card[],
  currentPlayerId: PlayerId,
  startingPlayerId: PlayerId,
  trumpSuit: CardSuit | false
) => {
  const ledSuit = playedCards[0].suit;
  const cardsSuit = filterBySuit(cards, ledSuit);

  // If the player has cards from the same suit, player has to provide (any of these cards)
  if (cardsSuit.length > 0) return cardsSuit;

  // At this point, the player cannot follow suit
  const cardsTrump = filterBySuit(cards, trumpSuit);

  // If the player does not have cards from the trump suit, they can play any card
  if (!cardsTrump.length) return cards;

  // At this point, the player has some cards from the trump suit
  // If they play second, they have to use a card from the trump suit
  if (playedCards.length === 1) return cardsTrump;

  // We determine if using a card from the trump suit is an obligation, based on the partner
  const playedCardsTrump = filterBySuit(playedCards, trumpSuit);

  // If there are no played cards from the trump suit, the player has to use a card from the trump suit only if their partner is not leading
  if (playedCardsTrump.length === 0) {
    const isLeading = isPartnerLeadingSuit(playedCards, currentPlayerId, startingPlayerId, ledSuit);
    if (isLeading) return cards;

    return cardsTrump;
  }

  // At this point, there are played cards from the trump suit
  const isLeading = isPartnerLeadingSuit(playedCards, currentPlayerId, startingPlayerId, trumpSuit);

  // If the partner is leading, the player can play any card
  if (isLeading) return cards;

  const higherCardsTrump = getHigherCardsSuit(cards, playedCards, trumpSuit);

  // The player has to use a card from the trump suit only if they can beat the opponent's card
  if (higherCardsTrump.length === 0) return cards;

  return higherCardsTrump;
};

/**
 * @name getLeaderIdSuit
 * @description Returns the id of the player who played the highest card for a given suit
 * @todo tests
 */
export const getLeaderIdSuit = (playedCards: Card[], startingPlayerId: PlayerId, suit: CardSuit | false) => {
  const highestPlayedCardSuit = getHighestCardSuit(playedCards, suit);

  const cardId = getCardId(playedCards, highestPlayedCardSuit);
  const leaderId = getPlayerId(startingPlayerId, cardId);

  return leaderId;
};

/**
 * @name isPartnerLeadingSuit
 * @description Returns whether the partner is leading the given suit
 * @todo tests
 */
export const isPartnerLeadingSuit = (
  playedCards: Card[],
  currentPlayerId: PlayerId,
  startingPlayerId: PlayerId,
  suit: CardSuit | false
) => {
  const leaderId = getLeaderIdSuit(playedCards, startingPlayerId, suit);

  return arePartners(currentPlayerId, leaderId);
};

/**
 * @name getWinnerIdTrick
 * @description Returns the id of the winner of a trick (each player should have given one card, otherwise it returns -1)
 */
export const getWinnerIdTrick = (playedCards: Card[], startingPlayerId: PlayerId, trumpSuit: CardSuit | false) => {
  if (playedCards.length !== NUMBER_PLAYERS) return -1;

  const ledSuit = playedCards[0].suit;
  const isTrumpSuit = trumpSuit === false || ledSuit === trumpSuit;
  const playedCardsTrumpSuit = filterBySuit(playedCards, trumpSuit);

  // If the led suit is the trump suit, the leader of this suit is the leader of the trick
  // If no cards from the trump suit has been played, the leader of the led suit is the leader of the trick
  // Otherwise, the leader of the trump suit is the leader of the trick
  // @todo tests by removing one or the other
  // @todo I think we can remove isTrumpSuit condition here (think about "en voiture" though)
  const importantSuit = isTrumpSuit || playedCardsTrumpSuit.length === 0 ? ledSuit : trumpSuit;
  const leaderId = getLeaderIdSuit(playedCards, startingPlayerId, importantSuit);

  return leaderId;
};

/**
 * @name getPlayerId
 * @description Returns the id of the player who played a given card (represented by its id in played cards)
 * @todo protect when cardId is 1
 */
export const getPlayerId = (playerId: PlayerId, cardId: number) => {
  return ((playerId + cardId) % NUMBER_PLAYERS) as PlayerId;
};
