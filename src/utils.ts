import { areEqual, differenceWith } from './cards';
import { Card } from './types';

/**
 * @name compareValues
 * @description Returns whether 1, 0 or -1 based on the comparison of two values
 */
export const compareValues = (a: number, b: number) => {
  if (a > b) return 1;
  if (a === b) return 0;

  return -1;
};

/**
 * @name flattenArray
 * @description Returns a flattened version of the array (only one level)
 */
export const flattenArray = (array: Card[][]) => {
  return array.reduce((a, b) => a.concat(b));
};

/**
 * @name getUniqueCards
 * @description Based on an exhaustive list of cards possibly in each player's hands,
 * it returns an array of the same format with only cards for which the owner is unique
 * e.g. [[c1, c2, c5], [c2, c3], [c2, c4], [c5]] becomes [[c1], [c3], [c4], []]
 */
export const getUniqueCards = (array: Card[][]) => {
  const uniqueCards: Card[][] = [];

  for (let i = 0; i < array.length; i++) {
    uniqueCards[i] = [];
  }

  for (let i = 0; i < array.length; i++) {
    const values = array[i];

    values.forEach((value) => {
      let isSureValue = true;

      for (let j = 0; j < array.length; j++) {
        if (i !== j) {
          const otherValues = array[j];

          // TODO: for performance, could be a short-circuit
          if (otherValues.includes(value)) isSureValue = false;
        }
      }

      if (isSureValue) {
        uniqueCards[i].push(value);
      }
    });
  }

  return uniqueCards;
};

/**
 * @name reduceOwnershipCards
 * @description Based on an exhaustive list of cards possibly in each player's hands,
 * it returns an array of the same format by removing ownership of a card if a player
 * does not have it for sure. This is based on deductions from the second argument
 * which indicates the exact number of cards each player has currently
 * e.g. [[c1, c2, c5], [c2, c3], [c2, c4], [c5]], [2, 1, 1, 1]
 * becomes
 * [[c1, c2], [c3], [c4], [c5]]
 */
export const reduceOwnershipCards = (array: Card[][], length: number[]) => {
  let canLoopAgain = true;

  while (canLoopAgain) {
    canLoopAgain = false;

    const uniqueCards = getUniqueCards(array);

    for (let i = 0; i < array.length; i++) {
      const expectedLength = length[i];
      const values = uniqueCards[i];

      if (values.length === expectedLength) {
        const newArray = uniqueCards[i];

        if (!areEqual(newArray, array[i])) {
          canLoopAgain = true;
          array[i] = newArray;
        }

        for (let j = 0; j < array.length; j++) {
          if (i !== j) {
            const newSubArray = differenceWith(array[j], values);

            if (!areEqual(newSubArray, array[j])) {
              canLoopAgain = true;
              array[j] = newSubArray;
            }
          }
        }
      }
    }
  }

  return array;
};
