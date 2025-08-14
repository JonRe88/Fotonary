export interface Team {
  id: string;
  name: string;
  color: string;
  score: number;
  players: string[];
}

export interface Word {
  id: string;
  word: string;
  category: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface GameSettings {
  roundTime: number;
  maxScore: number;
  teams: Team[];
  currentTeamIndex: number;
  currentPlayerIndex: number;
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  currentWord: Word | null;
  timeLeft: number;
  currentTeam: Team;
  roundHistory: RoundResult[];
}

export interface RoundResult {
  teamId: string;
  word: string;
  scored: boolean;
  timeUsed: number;
  drawer: string;
}

export interface DrawingPath {
  id: string;
  path: string;
  color: string;
  strokeWidth: number;
}