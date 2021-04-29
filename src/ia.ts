import { differenceWith, isEqual } from 'lodash';
import { excludeCards, excludeSuit, generateDeck } from './cards';
import { NUMBER_PLAYERS } from './constants';
import { getHighestPlayedCardSuit, getLeaderIdSuit, getPlayerId } from './game';
import { getPreviousRank } from './scores';
import { Card, CardRank, CardSuit, KnowledgeHighest } from './types';
import { adjustValues } from './utils';

export const updateKnowledgePresence = (
  knowledgePresence: KnowledgeHighest[],
  playedCards: Card[],
  startingPlayerId: number
) => {
  const kp = [...knowledgePresence];

  if (playedCards.length <= 1) return knowledgePresence;

  const requestedSuit = playedCards[0].suit;

  for (let i = 1; i < playedCards.length; i++) {
    if (playedCards[i].suit !== requestedSuit) {
      const playerId = getPlayerId(startingPlayerId, i);

      kp[playerId][requestedSuit] = undefined;
    }
  }

  return kp;
};

/**
 * TODO: add unit tests
 */
export const updateKnowledgeHighest = (
  knowledgeHighest: KnowledgeHighest[],
  playedCards: Card[],
  startingPlayerId: number,
  trumpSuit: CardSuit | false
) => {
  const kh = [...knowledgeHighest];

  const { Ten } = CardRank;

  if (playedCards.length <= 1) return knowledgeHighest;

  const requestedSuit = playedCards[0].suit;

  for (let i = 1; i < playedCards.length; i++) {
    const subsetPlayedCars = playedCards.slice(0, i + 1);
    const playerId = getPlayerId(startingPlayerId, i);
    const hasProvided = playedCards[i].suit === requestedSuit;

    const isTrumpSuit = trumpSuit === false || requestedSuit === trumpSuit;

    if (isTrumpSuit) {
      const highestPlayedCard = getHighestPlayedCardSuit(subsetPlayedCars, requestedSuit);
      const leaderIdSuit = getLeaderIdSuit(subsetPlayedCars, startingPlayerId, requestedSuit);
      const playerLeads = leaderIdSuit === playerId;
      const { rank: highestRank } = highestPlayedCard;
      const tenIsPlayed = highestRank === Ten;

      if (hasProvided && !playerLeads && !tenIsPlayed) {
        kh[playerId][requestedSuit] = getPreviousRank(highestRank) ?? Ten;
      }
    }
  }

  return kh;
};

export const updateKnowledgeCardsBasic = (
  knowledgePresence: KnowledgeHighest[],
  knowledgeCards: Card[][],
  botId: number
) => {
  const { Clubs, Diamonds, Hearts, Spades } = CardSuit;

  for (let playerId = 0; playerId < NUMBER_PLAYERS; playerId++) {
    const { clubs, diamonds, hearts, spades } = knowledgePresence[playerId];
    const isBot = playerId === botId;

    if (!isBot) {
      const suitArray: [CardRank | undefined, CardSuit][] = [
        [clubs, Clubs],
        [diamonds, Diamonds],
        [hearts, Hearts],
        [spades, Spades]
      ];

      suitArray.forEach((suitSubArray) => {
        const [suitPresence, suit] = suitSubArray;
        if (!suitPresence) {
          knowledgeCards[playerId] = excludeSuit(knowledgeCards[playerId], suit);
        }
      });
    }
  }

  return knowledgeCards;
};

export const updateKnowledgeCards = (
  knowledgePresence: KnowledgeHighest[],
  knowledgeCards: Card[][],
  allPlayedCards: Card[],
  botId: number,
  lengths: number[]
) => {
  const tempKnowledgeCards = updateKnowledgeCardsBasic(knowledgePresence, knowledgeCards, botId);

  for (let playerId = 0; playerId < NUMBER_PLAYERS; playerId++) {
    const isBot = playerId === botId;

    if (!isBot) {
      tempKnowledgeCards[playerId] = excludeCards(tempKnowledgeCards[playerId], allPlayedCards);
    }
  }

  const newKnowledgeCards = adjustValues(tempKnowledgeCards, lengths) as Card[][];

  return newKnowledgeCards;
};

export const initializeKnowledgeHighest = () => {
  const { Ten } = CardRank;
  const knowledgeHighest: KnowledgeHighest[] = [];

  for (let i = 0; i < NUMBER_PLAYERS; i++) {
    knowledgeHighest[i] = {
      clubs: Ten,
      diamonds: Ten,
      hearts: Ten,
      spades: Ten
    };
  }

  return knowledgeHighest;
};

export const initializeKnowledgeCards = (botCards: Card[], botId: number) => {
  const deck = generateDeck();

  const nonBotRemainingCards = differenceWith(deck, botCards, isEqual);

  const knowledgeCards = [];

  for (let playerId = 0; playerId < NUMBER_PLAYERS; playerId++) {
    const isBot = playerId === botId;

    knowledgeCards[playerId] = isBot ? botCards : nonBotRemainingCards;
  }

  return knowledgeCards;
};
