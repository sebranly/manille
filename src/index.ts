import { Card, Player } from './types';
import { NUMBER_PLAYERS } from './constants';

export const isSameTeam = (playerId1: number, playerId2: number) => {
  return playerId1 % 2 === playerId2 % 2;
};

export const distributeCards = (cards: Card[], players: Player[]) => {
  for (let i = 0; i < NUMBER_PLAYERS; i++) {
    const pickedCards = cards.splice(0, 3);
    players[i].cards = pickedCards;
  }

  for (let i = 0; i < NUMBER_PLAYERS; i++) {
    const pickedCards = cards.splice(0, 2);
    players[i].cards = [...players[i].cards, ...pickedCards];
  }

  for (let i = 0; i < NUMBER_PLAYERS; i++) {
    const pickedCards = cards.splice(0, 3);
    players[i].cards = [...players[i].cards, ...pickedCards];
  }
};
