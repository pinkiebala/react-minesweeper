import { useImmerReducer } from 'use-immer';

import { Action, GameState } from '@/lib/game/type';
import logger from '@/lib/logger';

import { BASIC_GAME_SETTING, DIRECTIONS, MAP_SETTINGS } from './constants';
import { getRandomInt } from './utils';

const gameReducer = (draft: GameState, action: Action): GameState => {
  function inRange(row: number, col: number) {
    return row >= 0 && row < draft.rowCount && col >= 0 && col < draft.colCount;
  }
  function setupMines(firstClickRow: number, firstClickCol: number) {
    let generatedMineCount = 0;
    const { rowCount, colCount, mineCount } = draft;
    while (generatedMineCount < mineCount) {
      const [mineRow, mineCol] = [rowCount, colCount].map(getRandomInt);
      if (
        (mineRow === firstClickRow && mineCol === firstClickCol) ||
        draft.board[mineRow][mineCol].isMine
      ) {
        continue;
      }
      draft.board[mineRow][mineCol].isMine = true;
      for (const [dx, dy] of DIRECTIONS) {
        const newRow = mineRow + dx;
        const newCol = mineCol + dy;
        if (inRange(newRow, newCol)) {
          draft.board[newRow][newCol].adjacentMines += 1;
        }
      }
      generatedMineCount++;
    }
    draft.isMineSet = true;
  }
  function reveal(row: number, col: number) {
    logger({ type: 'reveal', row, col });
    if (draft.board[row][col].isRevealed || draft.board[row][col].isFlagged) {
      return draft;
    }

    draft.board[row][col].isRevealed = true;

    if (draft.board[row][col].isMine) {
      draft.isGameOver = true;
      return draft;
    }

    // Check if winning
    draft.revealedCount += 1;
    if (
      draft.mineCount ===
      draft.colCount * draft.rowCount - draft.revealedCount
    ) {
      draft.isWin = true;
    }
  }
  function revealNoAdjacentMinesCell(row: number, col: number) {
    if (draft.board[row][col].adjacentMines !== 0) {
      return;
    }

    for (const [dx, dy] of DIRECTIONS) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (inRange(newRow, newCol) && !draft.board[newRow][newCol].isRevealed) {
        reveal(newRow, newCol);
        revealNoAdjacentMinesCell(newRow, newCol);
      }
    }
  }
  switch (action.type) {
    case 'INITIALIZE': {
      const { rowCount, colCount } = action;
      draft = {
        ...draft,
        ...action,
        ...BASIC_GAME_SETTING,
        board: Array.from({ length: rowCount }, () =>
          Array.from({ length: colCount }, () => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            adjacentMines: 0,
          }))
        ),
      };
      return draft;
    }
    case 'CLICK': {
      const { row, col } = action;

      if (!draft.isMineSet) setupMines(row, col);

      reveal(row, col);
      if (!draft.board[row][col].isMine) revealNoAdjacentMinesCell(row, col);

      return draft;
    }
    case 'TOGGLE_FLAG': {
      const { row, col } = action;
      draft.board[row][col].isFlagged = !draft.board[row][col].isFlagged;
      draft.flaggedCount += draft.board[row][col].isFlagged ? 1 : -1;

      return draft;
    }
    case 'REVEAL_REMAINS': {
      const { row, col } = action;
      if (!draft.board[row][col].isRevealed) return draft;

      let flaggedCount = 0;
      for (const [dx, dy] of DIRECTIONS) {
        const newRow = row + dx;
        const newCol = col + dy;
        if (draft.board[newRow]?.[newCol]?.isFlagged) {
          flaggedCount += 1;
        }
      }
      if (flaggedCount !== draft.board[row][col].adjacentMines) return draft;

      for (const [dx, dy] of DIRECTIONS) {
        const newRow = row + dx;
        const newCol = col + dy;
        if (inRange(newRow, newCol) && !draft.board[newRow][newCol].isFlagged) {
          reveal(newRow, newCol);
          if (!draft.board[newRow][newCol].isMine)
            revealNoAdjacentMinesCell(newRow, newCol);
        }
      }
      return draft;
    }
    default:
      return draft;
  }
};

const initialState = {
  ...MAP_SETTINGS.BEGINNER,
  ...BASIC_GAME_SETTING,
  board: Array.from({ length: MAP_SETTINGS.BEGINNER.rowCount }, () =>
    Array.from({ length: MAP_SETTINGS.BEGINNER.colCount }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  ),
};

export const useGameReducer = () => {
  return useImmerReducer(gameReducer, initialState);
};
