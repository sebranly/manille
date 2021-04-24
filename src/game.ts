import { compareCardRanks } from './scores';
import { Card, CardRank, CardSuit } from './types';

export const getPlayableCards = (
  cards: Card[],
  playedCards: Card[],
  currentPlayerId: number,
  startingPlayerId: number,
  trumpSuit: CardSuit | false
) => {
  const isPlayerStarting = playedCards.length === 0 && currentPlayerId === startingPlayerId;
  const hasOneCard = cards.length <= 1;
  const canPlayAll = isPlayerStarting || hasOneCard;

  if (canPlayAll) return cards;

  const isTrumpSuit = playedCards.length >= 1 && (trumpSuit === false || playedCards[0].suit === trumpSuit);

  if (isTrumpSuit) {
    const playedTrumpSuit = playedCards[0].suit;

    // TODO: create a function for it
    const cardsTrump = cards.filter((card: Card) => card.suit === playedTrumpSuit);

    if (cardsTrump.length === 0) return cards;
    if (cardsTrump.length === 1) return cardsTrump;

    const playedCardsTrump = playedCards.filter((card: Card) => card.suit === playedTrumpSuit);
    const sortedPlayedCardsTrump = playedCardsTrump.sort((a, b) => -1 * compareCardRanks(a.rank, b.rank));
    const highestPlayedCardTrump = sortedPlayedCardsTrump[0];
    const { Ten } = CardRank;

    if (highestPlayedCardTrump.rank === Ten) return cardsTrump;

    const higherCardsTrump = cardsTrump.filter(
      (card: Card) => compareCardRanks(card.rank, highestPlayedCardTrump.rank) === 1
    );

    if (higherCardsTrump.length === 0) return cardsTrump;

    return higherCardsTrump;
  }

  return [];
};
