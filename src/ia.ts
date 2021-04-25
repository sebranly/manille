import { differenceWith, isEqual } from 'lodash';
import { excludeSuit, generateDeck } from './cards';
import { NUMBER_PLAYERS } from './constants';
import { getPlayerId } from './game';
import { Card, CardSuit, KnowledgeSuit } from './types';

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
    // They did not provide
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
    // Note: ignore bot for now
    if (playerId !== botId) {
      const { hasClubs, hasDiamonds, hasHearts, hasSpades } = knowledgePanel[playerId];

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

export const initializeKnowledgeCards = (cards: Card[], botId: number) => {
  const deck = generateDeck();

  const nonBotRemainingCards = differenceWith(deck, cards, isEqual);

  const knowledgeCards = [];

  for (let playerId = 0; playerId < NUMBER_PLAYERS; playerId++) {
    const isBot = playerId === botId;

    knowledgeCards[playerId] = isBot ? cards : nonBotRemainingCards;
  }

  return knowledgeCards;
};
