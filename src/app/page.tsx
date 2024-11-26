'use client';

import type { MouseEvent } from 'react';
import { useCallback } from 'react';
import '@/lib/env';

import { GameContextProvider, useGameContext } from '@/lib/game';
import logger from '@/lib/logger';

import { Cell } from '@/components/cell';
import { ControlBar } from '@/components/control-bar';

const CELL_WIDTH = '40px';

function getDataAttr(dataset: DOMStringMap) {
  const { row: rowStr, col: colStr, isrevealed } = dataset;

  if (!rowStr || !colStr || !isrevealed) return null;
  return {
    row: parseInt(rowStr, 10),
    col: parseInt(colStr, 10),
    isRevealed: isrevealed === 'true',
  };
}

function HomePage() {
  const { state, dispatch } = useGameContext();

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
      <ControlBar />
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
        {state.board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            return (
              <Cell
                key={[rowIndex, colIndex].join('_')}
                {...cell}
                row={rowIndex}
                col={colIndex}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default function HomePageWithGameContextProvider() {
  return (
    <GameContextProvider>
      <HomePage />
    </GameContextProvider>
  );
}
