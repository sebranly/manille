import { Card, Player, PlayerId } from './types';
import { NUMBER_PLAYERS } from './constants';

/**
 * @name arePartners
 * @description Returns whether two players are partners
 */
export const arePartners = (playerId1: PlayerId, playerId2: PlayerId) => {
  return playerId1 % 2 === playerId2 % 2;
};

/**
 * @name dealCards
 * @description Deals cards by following the 3-2-3 pattern from Manille
 */
export const dealCards = (cards: Card[], players: Player[]) => {
  const dealtCardsLength = [3, 2, 3];

  for (const length of dealtCardsLength) {
    for (let i = 0; i < NUMBER_PLAYERS; i++) {
      const pickedCards = cards.splice(0, length);
      if (players[i].cards) players[i].cards.push(...pickedCards)
      else players[i].cards = pickedCards;
    }
  }
};
