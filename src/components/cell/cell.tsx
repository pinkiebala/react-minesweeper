import clsx from 'clsx';

import { TCell } from '@/lib/game/type';

type CellProps = TCell & {
  row: number;
  col: number;
};

export const Cell = ({
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
