import { Card } from './types';

export const compareValues = (a: number, b: number) => {
  if (a > b) return 1;
  if (a === b) return 0;

  return -1;
};

// TODO: use generic type?
export const flattenArray = (array: Card[][]) => {
  return array.reduce((a, b) => a.concat(b));
};

// TODO: use generic type?
export const getSureValues = (array: any[][]) => {
  const sureValues: any = [];

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

      if (isSureValue) sureValues[i].push(value);
    });
  }

  return sureValues;
};

export const getSureValuesWithLength = (array: any[][], length: number[]) => {
  const sureValuesBasic = getSureValues(array);

  return sureValuesBasic;
};
