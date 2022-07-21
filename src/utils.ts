import { areSameOrderedCards, differenceWith } from './cards';
import { Card } from './types';

export const compareValues = (a: number, b: number) => {
  if (a > b) return 1;
  if (a === b) return 0;

  return -1;
};

export const flattenArray = (array: Card[][]) => {
  return array.reduce((a, b) => a.concat(b));
};

export const getSureValues = (array: Card[][]) => {
  const sureValues: Card[][] = [];

  for (let i = 0; i < array.length; i++) {
    sureValues[i] = [];
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
        sureValues[i].push(value);
      }
    });
  }

  return sureValues;
};

export const adjustValues = (array: Card[][], length: number[]) => {
  let canLoopAgain = true;

  while (canLoopAgain) {
    canLoopAgain = false;

    const sureValues = getSureValues(array);

    for (let i = 0; i < array.length; i++) {
      const expectedLength = length[i];
      const values = sureValues[i];

      if (values.length === expectedLength) {
        const newArray = sureValues[i];

        if (!areSameOrderedCards(newArray, array[i])) {
          canLoopAgain = true;
          array[i] = newArray;
        }

        for (let j = 0; j < array.length; j++) {
          if (i !== j) {
            const newSubArray = differenceWith(array[j], values);

            if (!areSameOrderedCards(newSubArray, array[j])) {
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
