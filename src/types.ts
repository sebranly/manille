export enum CardSuit {
  Clubs = 'clubs',
  Diamonds = 'diamonds',
  Hearts = 'hearts',
  Spades = 'spades'
}

export enum CardRank {
  Ace = 'ace',
  Eight = 'eight',
  Jack = 'jack',
  King = 'king',
  Nine = 'nine',
  Queen = 'queen',
  Seven = 'seven',
  Ten = 'ten'
}

export interface Card {
  rank: CardRank;
  suit: CardSuit;
}

export interface Player {
  id: number;
  cards: Card[];
  name: string;
}

export interface Turn {
  tbd: any;
}

export interface Round {
  turns: Turn[];
}

export interface Game {
  players: Player[];
  rounds: Round[];
}

export interface InfoSuitHighest {
  clubs?: CardRank;
  diamonds?: CardRank;
  hearts?: CardRank;
  spades?: CardRank;
}
