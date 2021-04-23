export const isSameTeam = (playerId1: number, playerId2: number) => {
  return playerId1 % 2 === playerId2 % 2;
};
