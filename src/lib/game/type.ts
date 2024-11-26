export type TCell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

export type GameState = {
  rowCount: number;
  colCount: number;
  mineCount: number;
  revealedCount: number;
  flaggedCount: number;
  board: TCell[][];
  isMineSet: boolean;
  isGameOver: boolean;
  isWin: boolean;
};

export type Action =
  | {
      type: 'INITIALIZE';
      rowCount: number;
      colCount: number;
      mineCount: number;
    }
  | { type: 'CLICK'; row: number; col: number }
  | { type: 'TOGGLE_FLAG'; row: number; col: number }
  | { type: 'REVEAL_REMAINS'; row: number; col: number };
