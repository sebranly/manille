import { differenceWith, isEqual } from 'lodash';
import { excludeCards, excludeSuit, excludeSuitOver, generateDeck } from './cards';
import { NUMBER_PLAYERS } from './constants';
import { getHighestPlayedCardSuit, getLeaderIdSuit, getPlayerId } from './game';
import { compareCardRanks, getPreviousRank } from './scores';
import { Card, CardRank, CardSuit, InfoSuitHighest } from './types';
import { adjustValues } from './utils';

/**
 * TODO: add more unit tests for else if
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

    if (!hasProvided) {
      info[playerId][requestedSuit] = undefined;
    } else if (isTrumpSuit) {
      const highestPlayedCard = getHighestPlayedCardSuit(subsetPlayedCars, requestedSuit);
      const leaderIdSuit = getLeaderIdSuit(subsetPlayedCars, startingPlayerId, requestedSuit);
      const playerLeads = leaderIdSuit === playerId;
      const { rank: highestRank } = highestPlayedCard;
      const tenIsPlayed = highestRank === Ten;

      if (!playerLeads && !tenIsPlayed) {
        const previousRank = getPreviousRank(highestRank);
        if (!previousRank) {
          info[playerId][requestedSuit] = undefined;
        } else if (
          !!info[playerId][requestedSuit] &&
          compareCardRanks(info[playerId][requestedSuit]!, previousRank) > 1
        ) {
          info[playerId][requestedSuit] = previousRank;
        }
      }
    }
  }

  return info;
};

export const updateInfoCardsHighest = (infoSuitHighest: InfoSuitHighest[], infoCards: Card[][], botId: number) => {
  const { Clubs, Diamonds, Hearts, Spades } = CardSuit;

  for (let playerId = 0; playerId < NUMBER_PLAYERS; playerId++) {
    const { clubs, diamonds, hearts, spades } = infoSuitHighest[playerId];
    const isBot = playerId === botId;

    if (!isBot) {
      const suitArray: [CardRank | undefined, CardSuit][] = [
        [clubs, Clubs],
        [diamonds, Diamonds],
        [hearts, Hearts],
        [spades, Spades]
      ];

      suitArray.forEach((suitSubArray) => {
        const [suitHighest, suit] = suitSubArray;
        if (!suitHighest) {
          infoCards[playerId] = excludeSuit(infoCards[playerId], suit);
        } else {
          infoCards[playerId] = excludeSuitOver(infoCards[playerId], suit, suitHighest);
        }
      });
    }
  }

  return infoCards;
};

export const updateInfoCards = (
  infoSuitHighest: InfoSuitHighest[],
  infoCards: Card[][],
  allPlayedCards: Card[],
  botId: number,
  lengths: number[]
) => {
  const tempInfoCards = updateInfoCardsHighest(infoSuitHighest, infoCards, botId);

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
