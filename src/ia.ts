import { differenceWith, isEqual } from 'lodash';
import { excludeCards, excludeSuit, generateDeck } from './cards';
import { NUMBER_PLAYERS } from './constants';
import { getHighestPlayedCardSuit, getLeaderIdSuit, getPlayerId } from './game';
import { getPreviousRank } from './scores';
import { Card, CardRank, CardSuit, InfoSuitHighest } from './types';
import { adjustValues } from './utils';

export const updateInfoPresence = (infoPresence: InfoSuitHighest[], playedCards: Card[], startingPlayerId: number) => {
  const info = [...infoPresence];

  if (playedCards.length <= 1) return infoPresence;

  const requestedSuit = playedCards[0].suit;

  for (let i = 1; i < playedCards.length; i++) {
    if (playedCards[i].suit !== requestedSuit) {
      const playerId = getPlayerId(startingPlayerId, i);

      info[playerId][requestedSuit] = undefined;
    }
  }

  return info;
};

/**
 * TODO: add unit tests
 */
export const updateInfoSuitHighest = (
  infoSuitHighest: InfoSuitHighest[],
  playedCards: Card[],
  startingPlayerId: number,
  trumpSuit: CardSuit | false
) => {
  const info = [...infoSuitHighest];

  const { Ten } = CardRank;

  if (playedCards.length <= 1) return infoSuitHighest;

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
        info[playerId][requestedSuit] = getPreviousRank(highestRank);
      }
    }
  }

  return info;
};

export const updateInfoCardsBasic = (infoPresence: InfoSuitHighest[], infoCards: Card[][], botId: number) => {
  const { Clubs, Diamonds, Hearts, Spades } = CardSuit;

  for (let playerId = 0; playerId < NUMBER_PLAYERS; playerId++) {
    const { clubs, diamonds, hearts, spades } = infoPresence[playerId];
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
          infoCards[playerId] = excludeSuit(infoCards[playerId], suit);
        }
      });
    }
  }

  return infoCards;
};

export const updateInfoCards = (
  infoPresence: InfoSuitHighest[],
  infoCards: Card[][],
  allPlayedCards: Card[],
  botId: number,
  lengths: number[]
) => {
  const tempInfoCards = updateInfoCardsBasic(infoPresence, infoCards, botId);

  for (let playerId = 0; playerId < NUMBER_PLAYERS; playerId++) {
    const isBot = playerId === botId;

    if (!isBot) {
      tempInfoCards[playerId] = excludeCards(tempInfoCards[playerId], allPlayedCards);
    }
  }

  const newInfoCards = adjustValues(tempInfoCards, lengths) as Card[][];

  return newInfoCards;
};

export const initializeInfoSuitHighest = () => {
  const { Ten } = CardRank;
  const infoSuitHighest: InfoSuitHighest[] = [];

  for (let i = 0; i < NUMBER_PLAYERS; i++) {
    infoSuitHighest[i] = {
      clubs: Ten,
      diamonds: Ten,
      hearts: Ten,
      spades: Ten
    };
  }

  return infoSuitHighest;
};

export const initializeInfoCards = (botCards: Card[], botId: number) => {
  const deck = generateDeck();

  const nonBotRemainingCards = differenceWith(deck, botCards, isEqual);

  const infoCards = [];

  for (let playerId = 0; playerId < NUMBER_PLAYERS; playerId++) {
    const isBot = playerId === botId;

    infoCards[playerId] = isBot ? botCards : nonBotRemainingCards;
  }

  return infoCards;
};
