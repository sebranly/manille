import { Card } from './types';

export const compareValues = (a: number, b: number) => {
  if (a > b) return 1;
  if (a === b) return 0;

  return -1;
};

// TODO: use generic type
export const flattenArray = (array: Card[][]) => {
  return array.reduce((a, b) => a.concat(b));
};
