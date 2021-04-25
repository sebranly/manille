import { differenceWith, isEqual } from 'lodash';
import { excludeCards, excludeSuit, generateDeck } from './cards';
import { NUMBER_PLAYERS } from './constants';
import { getPlayerId } from './game';
import { Card, CardSuit, KnowledgeSuit } from './types';
import { adjustValues } from './utils';

export const updateKnowledgePanelSuits = (
  knowledgePanel: KnowledgeSuit[],
  playedCards: Card[],
  startingPlayerId: number
) => {
  const kp = [...knowledgePanel];
  const { Clubs, Diamonds, Hearts, Spades } = CardSuit;

  if (playedCards.length <= 1) return knowledgePanel;

  const requestedSuit = playedCards[0].suit;

  for (let i = 1; i < playedCards.length; i++) {
    if (playedCards[i].suit !== requestedSuit) {
      const playerId = getPlayerId(startingPlayerId, i);

      switch (requestedSuit) {
        case Clubs:
          kp[playerId].hasClubs = false;
          break;

        case Diamonds:
          kp[playerId].hasDiamonds = false;
          break;

        case Hearts:
          kp[playerId].hasHearts = false;
          break;

        case Spades:
          kp[playerId].hasSpades = false;
          break;
      }
    }
  }

  return kp;
};

export const updateKnowledgePanelCardsBasic = (
  knowledgePanel: KnowledgeSuit[],
  knowledgeCards: Card[][],
  botId: number
) => {
  const { Clubs, Diamonds, Hearts, Spades } = CardSuit;

  for (let playerId = 0; playerId < NUMBER_PLAYERS; playerId++) {
    const { hasClubs, hasDiamonds, hasHearts, hasSpades } = knowledgePanel[playerId];
    const isBot = playerId === botId;

    if (!isBot) {
      if (!hasClubs) {
        knowledgeCards[playerId] = excludeSuit(knowledgeCards[playerId], Clubs);
      }

      if (!hasDiamonds) {
        knowledgeCards[playerId] = excludeSuit(knowledgeCards[playerId], Diamonds);
      }

      if (!hasHearts) {
        knowledgeCards[playerId] = excludeSuit(knowledgeCards[playerId], Hearts);
      }

      if (!hasSpades) {
        knowledgeCards[playerId] = excludeSuit(knowledgeCards[playerId], Spades);
      }
    }
  }

  return knowledgeCards;
};

export const updateKnowledgePanelCards = (
  knowledgePanel: KnowledgeSuit[],
  knowledgeCards: Card[][],
  allPlayedCards: Card[],
  botId: number,
  lengths: number[]
) => {
  const tempKnowledgeCards = updateKnowledgePanelCardsBasic(knowledgePanel, knowledgeCards, botId);

  for (let playerId = 0; playerId < NUMBER_PLAYERS; playerId++) {
    const isBot = playerId === botId;

    if (!isBot) {
      tempKnowledgeCards[playerId] = excludeCards(tempKnowledgeCards[playerId], allPlayedCards);
    }
  }

  const newKnowledgeCards = adjustValues(tempKnowledgeCards, lengths) as Card[][];

  return newKnowledgeCards;
};

export const initializeKnowledgePanel = () => {
  const knowledgePanel: KnowledgeSuit[] = [];

  for (let i = 0; i < NUMBER_PLAYERS; i++) {
    knowledgePanel[i] = {
      hasClubs: true,
      hasDiamonds: true,
      hasHearts: true,
      hasSpades: true
    };
  }

  return knowledgePanel;
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
