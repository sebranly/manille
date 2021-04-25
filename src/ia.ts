import { NUMBER_PLAYERS } from './constants';
import { getPlayerId } from './game';
import { Card, CardSuit, Knowledge } from './types';

export const updateKnowledgePanelSuits = (
  knowledgePanel: Knowledge[],
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

export const initializeKnowledgePanel = () => {
  const knowledgePanel: Knowledge[] = [];

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
