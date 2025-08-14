import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Team, GameSettings, GameState, Word, RoundResult } from '@/types/game';

interface GameContextType {
  settings: GameSettings;
  gameState: GameState;
  updateSettings: (settings: Partial<GameSettings>) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endRound: (scored: boolean) => void;
  nextTurn: () => void;
  updateScore: (teamId: string, points: number) => void;
  resetGame: () => void;
  setCurrentWord: (word: Word) => void;
  updateTimeLeft: (time: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameAction {
  type: string;
  payload?: any;
}

const initialSettings: GameSettings = {
  roundTime: 60,
  maxScore: 20,
  teams: [
    { id: '1', name: 'Equipo 1', color: '#3B82F6', score: 0, players: [] },
    { id: '2', name: 'Equipo 2', color: '#10B981', score: 0, players: [] },
  ],
  currentTeamIndex: 0,
  currentPlayerIndex: 0,
};

const initialGameState: GameState = {
  isPlaying: false,
  isPaused: false,
  currentWord: null,
  timeLeft: 60,
  currentTeam: initialSettings.teams[0],
  roundHistory: [],
};

function gameReducer(state: { settings: GameSettings; gameState: GameState }, action: GameAction) {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case 'START_GAME':
      return {
        ...state,
        gameState: {
          ...state.gameState,
          isPlaying: true,
          isPaused: false,
          timeLeft: state.settings.roundTime,
          currentTeam: state.settings.teams[state.settings.currentTeamIndex],
        },
      };

    case 'PAUSE_GAME':
      return {
        ...state,
        gameState: { ...state.gameState, isPaused: true },
      };

    case 'RESUME_GAME':
      return {
        ...state,
        gameState: { ...state.gameState, isPaused: false },
      };

    case 'END_ROUND':
      const { scored } = action.payload;
      const currentTeam = state.settings.teams[state.settings.currentTeamIndex];
      const newScore = scored ? currentTeam.score + (state.gameState.currentWord?.points || 1) : currentTeam.score;
      
      const updatedTeams = state.settings.teams.map(team =>
        team.id === currentTeam.id ? { ...team, score: newScore } : team
      );

      const roundResult: RoundResult = {
        teamId: currentTeam.id,
        word: state.gameState.currentWord?.word || '',
        scored,
        timeUsed: state.settings.roundTime - state.gameState.timeLeft,
        drawer: `Jugador ${state.settings.currentPlayerIndex + 1}`,
      };

      return {
        ...state,
        settings: {
          ...state.settings,
          teams: updatedTeams,
        },
        gameState: {
          ...state.gameState,
          roundHistory: [...state.gameState.roundHistory, roundResult],
          isPlaying: false,
        },
      };

    case 'NEXT_TURN':
      const nextPlayerIndex = (state.settings.currentPlayerIndex + 1) % (state.settings.teams[state.settings.currentTeamIndex].players.length || 1);
      const nextTeamIndex = nextPlayerIndex === 0 ? (state.settings.currentTeamIndex + 1) % state.settings.teams.length : state.settings.currentTeamIndex;
      
      return {
        ...state,
        settings: {
          ...state.settings,
          currentTeamIndex: nextTeamIndex,
          currentPlayerIndex: nextPlayerIndex,
        },
        gameState: {
          ...state.gameState,
          currentTeam: state.settings.teams[nextTeamIndex],
          timeLeft: state.settings.roundTime,
          currentWord: null,
        },
      };

    case 'UPDATE_SCORE':
      const { teamId, points } = action.payload;
      const teamsWithUpdatedScore = state.settings.teams.map(team =>
        team.id === teamId ? { ...team, score: Math.max(0, team.score + points) } : team
      );

      return {
        ...state,
        settings: {
          ...state.settings,
          teams: teamsWithUpdatedScore,
        },
      };

    case 'RESET_GAME':
      return {
        settings: {
          ...state.settings,
          teams: state.settings.teams.map(team => ({ ...team, score: 0 })),
          currentTeamIndex: 0,
          currentPlayerIndex: 0,
        },
        gameState: {
          ...initialGameState,
          timeLeft: state.settings.roundTime,
        },
      };

    case 'SET_CURRENT_WORD':
      return {
        ...state,
        gameState: { ...state.gameState, currentWord: action.payload },
      };

    case 'UPDATE_TIME_LEFT':
      return {
        ...state,
        gameState: { ...state.gameState, timeLeft: action.payload },
      };

    default:
      return state;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, {
    settings: initialSettings,
    gameState: initialGameState,
  });

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
  };

  const startGame = () => {
    dispatch({ type: 'START_GAME' });
  };

  const pauseGame = () => {
    dispatch({ type: 'PAUSE_GAME' });
  };

  const resumeGame = () => {
    dispatch({ type: 'RESUME_GAME' });
  };

  const endRound = (scored: boolean) => {
    dispatch({ type: 'END_ROUND', payload: { scored } });
  };

  const nextTurn = () => {
    dispatch({ type: 'NEXT_TURN' });
  };

  const updateScore = (teamId: string, points: number) => {
    dispatch({ type: 'UPDATE_SCORE', payload: { teamId, points } });
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const setCurrentWord = (word: Word) => {
    dispatch({ type: 'SET_CURRENT_WORD', payload: word });
  };

  const updateTimeLeft = (time: number) => {
    dispatch({ type: 'UPDATE_TIME_LEFT', payload: time });
  };

  return (
    <GameContext.Provider
      value={{
        settings: state.settings,
        gameState: state.gameState,
        updateSettings,
        startGame,
        pauseGame,
        resumeGame,
        endRound,
        nextTurn,
        updateScore,
        resetGame,
        setCurrentWord,
        updateTimeLeft,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}