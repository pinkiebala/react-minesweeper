import { createContext, Dispatch, ReactNode, useContext } from 'react';

import { useGameReducer } from '@/lib/game/game';
import { Action, GameState } from '@/lib/game/type';

type GameContextType = {
  state: GameState;
  dispatch: Dispatch<Action>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useGameReducer();

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
