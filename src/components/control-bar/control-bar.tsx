import React, { MouseEvent, useCallback } from 'react';

import { MAP_SETTINGS } from '@/lib/game/constants';
import { useGameContext } from '@/lib/game/context';
import logger from '@/lib/logger';

export const ControlBar = () => {
  const { state, dispatch } = useGameContext();

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

  return (
    <div className='flex text-2xl justify-center py-4 relative'>
      <span className='text-red-600 font-2xl absolute left-0'>
        {state.mineCount - state.flaggedCount}
      </span>
      <button type='button' onClick={handleInitialize}>
        {state.isGameOver ? '😵' : state.isWin ? '😎' : '🙂'}
      </button>
    </div>
  );
};
