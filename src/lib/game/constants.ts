export const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export const MAP_SETTINGS = {
  BEGINNER: {
    rowCount: 9,
    colCount: 9,
    mineCount: 10,
  },
};

export const BASIC_GAME_SETTING = {
  revealedCount: 0,
  flaggedCount: 0,
  isGameOver: false,
  isMineSet: false,
  isWin: false,
};
