export type GameStatus = 'scheduled' | 'live' | 'finished' | 'cancelled';
export type EventType = 'goal' | 'assist' | 'yellowCard' | 'redCard';

export interface Team {
  id: number;
  name: string;
  modality: string;
  category: string;
}

export interface Player {
  id: number;
  name: string;
  number: number;
  team_id: number;
}

export interface Game {
  id: number;
  sport: string;
  team_a: number;
  team_b: number;
  team_a_name: string;
  team_b_name: string;
  score_a: number;
  score_b: number;
  date: string;
  time: string;
  game_time: string;
  period: string;
  location: string;
  category: string;
  status: GameStatus;
  highlights?: GameEvent[];
}

export interface GameEvent {
  id: number;
  game_id: number;
  player_id: number;
  team: 'A' | 'B';
  type: EventType;
  created_at: string;
  updated_at: string;
} 