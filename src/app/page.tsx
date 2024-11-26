'use client';

import clsx from 'clsx';
import type { MouseEvent } from 'react';
import { useCallback } from 'react';
import '@/lib/env';

import { TCell, useGameReducer } from '@/lib/game';
import { MAP_SETTINGS } from '@/lib/game/constants';
import logger from '@/lib/logger';

const CELL_WIDTH = '40px';

type CellProps = TCell & {
  row: number;
  col: number;
};

const Cell = ({
  isFlagged,
  isMine,
  isRevealed,
  adjacentMines,
  row,
  col,
}: CellProps) => {
  return (
    <div
      className={clsx(
        'cursor-pointer flex items-center justify-center text-lg font-bold',
        [isRevealed ? 'bg-gray-300' : 'bg-gray-400 pointer']
      )}
      data-row={row}
      data-col={col}
      data-isrevealed={isRevealed}
    >
      {}
      {isRevealed
        ? isMine
          ? '💣'
          : adjacentMines > 0
          ? adjacentMines
          : ''
        : isFlagged && '🚩'}
    </div>
  );
};

function getDataAttr(dataset: DOMStringMap) {
  const { row: rowStr, col: colStr, isrevealed } = dataset;

  if (!rowStr || !colStr || !isrevealed) return null;
  return {
    row: parseInt(rowStr, 10),
    col: parseInt(colStr, 10),
    isRevealed: isrevealed === 'true',
  };
}

export default function HomePage() {
  const [state, dispatch] = useGameReducer();

  const handleInitialize = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();

      logger({ action: 'INITIALIZE' });
      dispatch({
        type: 'INITIALIZE',
        ...MAP_SETTINGS.BEGINNER,
      });
    },
    [dispatch]
  );

  const handleClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      if (state.isWin || state.isGameOver) return;
      if (!(event.target instanceof HTMLDivElement)) {
        return;
      }
      const parsedDataSet = getDataAttr(event.target.dataset);
      if (!parsedDataSet) return;
      const { row, col, isRevealed } = parsedDataSet;
      if (isRevealed) return;

      if (event.type === 'click') {
        dispatch({ type: 'CLICK', row, col });
        logger({ action: 'CLICK', row, col, isRevealed });
      } else if (event.type === 'contextmenu') {
        dispatch({ type: 'TOGGLE_FLAG', row, col });
        logger({ action: 'TOGGLE_FLAG', row, col, isRevealed });
      }
    },
    [state.isWin, state.isGameOver, dispatch]
  );

  const handleDoubleClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      if (state.isWin || state.isGameOver) return;
      if (!(event.target instanceof HTMLDivElement)) {
        return;
      }
      const parsedDataSet = getDataAttr(event.target.dataset);
      if (!parsedDataSet) return;
      const { row, col, isRevealed } = parsedDataSet;
      logger({ action: 'REVEAL_REMAINS', row, col, isRevealed });
      if (!isRevealed) return;

      dispatch({
        type: 'REVEAL_REMAINS',
        row,
        col,
      });
    },
    [state.isWin, state.isGameOver, dispatch]
  );

  return (
    <div className='mx-auto w-min'>
      <div className='flex text-2xl justify-center py-4 relative'>
        <span className='text-red-600 font-2xl absolute left-0'>
          {state.mineCount - state.flaggedCount}
        </span>
        <button type='button' onClick={handleInitialize}>
          {state.isGameOver ? '😵' : state.isWin ? '😎' : '🙂'}
        </button>
      </div>
      <div
        className='border-solid mx-auto grid gap-[1px] select-none'
        style={{
          gridTemplateColumns: `repeat(${state.colCount},${CELL_WIDTH})`,
          gridTemplateRows: `repeat(${state.rowCount},${CELL_WIDTH})`,
        }}
        onClick={handleClick}
        onContextMenu={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {state.board.map((row, rowIndex) => (
          <>
            {row.map((cell, colIndex) => {
              return (
                <Cell
                  key={[rowIndex, colIndex].join('_')}
                  {...cell}
                  row={rowIndex}
                  col={colIndex}
                />
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}
