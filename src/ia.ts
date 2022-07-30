import { differenceWith, excludeSuit, excludeSuitOver, generateDeck } from './cards';
import { NUMBER_PLAYERS } from './constants';
import { getHighestCardSuit, getLeaderIdSuit, getPlayerId, isPartnerLeadingSuit } from './game';
import { compareCardRanks, getPreviousRank } from './scores';
import { Card, CardRank, CardSuit, InfoSuitHighest, PlayerId } from './types';
import { reduceOwnershipCards } from './utils';

// TODO: add comments on functions

export const updateInfoSuitHighest = (
  infoSuitHighest: InfoSuitHighest[],
  playedCards: Card[],
  startingPlayerId: PlayerId,
  trumpSuit: CardSuit | false
) => {
  const info = [...infoSuitHighest];

  const playedCardsLength = playedCards.length;
  if (playedCardsLength <= 1 || playedCardsLength > NUMBER_PLAYERS) return infoSuitHighest;

  const ledSuit = playedCards[0].suit;

  for (let i = 1; i < playedCardsLength; i++) {
    const subsetPlayedCars = playedCards.slice(0, i + 1);

    const playerId = getPlayerId(startingPlayerId, i);
    const playerSuit = playedCards[i].suit;
    const hasProvided = playerSuit === ledSuit;
    const isTrumpSuit = trumpSuit === false || ledSuit === trumpSuit;

    if (!hasProvided) {
      info[playerId][ledSuit] = undefined;

      if (trumpSuit) {
        const highestPlayedCardTrumpSuit = getHighestCardSuit(subsetPlayedCars, trumpSuit);

        if (!!highestPlayedCardTrumpSuit) {
          const isLeading = isPartnerLeadingSuit(subsetPlayedCars, playerId, startingPlayerId, trumpSuit);
          const { rank: highestRank } = highestPlayedCardTrumpSuit;

          if (!isLeading) {
            info[playerId][trumpSuit] = getNewSuitHighest(info[playerId][trumpSuit], highestRank);
          }
        } else {
          info[playerId][trumpSuit] = undefined;
        }
      }
    } else if (isTrumpSuit) {
      const highestPlayedCard = getHighestCardSuit(subsetPlayedCars, ledSuit);
      const leaderIdSuit = getLeaderIdSuit(subsetPlayedCars, startingPlayerId, ledSuit);
      const playerLeads = leaderIdSuit === playerId;
      const { rank: highestRank } = highestPlayedCard;

      if (!playerLeads) {
        info[playerId][ledSuit] = getNewSuitHighest(info[playerId][ledSuit], highestRank);
      }
    }
  }

  return info;
};

export const getNewSuitHighest = (highestSuit: CardRank | undefined, highestRank: CardRank) => {
  const previousRank = getPreviousRank(highestRank);

  if (!previousRank) {
    return undefined;
  } else if (!!highestSuit && compareCardRanks(highestSuit, previousRank) > 0) {
    return previousRank;
  }

  return highestSuit;
};

export const updateInfoCardsHighest = (infoSuitHighest: InfoSuitHighest[], infoCards: Card[][], botId: PlayerId) => {
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
        if (suitHighest) {
          infoCards[playerId] = excludeSuitOver(infoCards[playerId], suit, suitHighest);
        } else {
          infoCards[playerId] = excludeSuit(infoCards[playerId], suit);
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
  botId: PlayerId,
  lengths: number[]
) => {
  const tempInfoCards = updateInfoCardsHighest(infoSuitHighest, infoCards, botId);

  for (let playerId = 0; playerId < NUMBER_PLAYERS; playerId++) {
    const isBot = playerId === botId;

    if (!isBot) {
      tempInfoCards[playerId] = differenceWith(tempInfoCards[playerId], allPlayedCards);
    }
  }

  const newInfoCards = reduceOwnershipCards(tempInfoCards, lengths) as Card[][];

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

export const initializeInfoCards = (botCards: Card[], botId: PlayerId) => {
  const deck = generateDeck();

  const nonBotRemainingCards = differenceWith(deck, botCards);

  const infoCards = [];

  for (let playerId = 0; playerId < NUMBER_PLAYERS; playerId++) {
    const isBot = playerId === botId;

    infoCards[playerId] = isBot ? botCards : nonBotRemainingCards;
  }

  return infoCards;
};
