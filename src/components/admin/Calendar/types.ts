export type GameStatus = 'scheduled' | 'live' | 'finished' | 'cancelled';
export type EventType = 'goal' | 'yellow_card' | 'red_card' | 'substitution';

export interface Team {
  id: number;
  name: string;
  modality: string;
  category: string;
}

export interface GameEvent {
  created_at: string;
  player_id: number;
  team: 'A' | 'B';
  type: EventType;
}

export interface Match {
  id: number;
  date: string;
  time: string;
  sport: string;
  team_a: number;
  team_b: number;
  team_a_name?: string;
  team_b_name?: string;
  location: string;
  category: string;
  status: GameStatus;
  score_a?: number;
  score_b?: number;
  game_time?: string;
  period?: string;
  highlights?: GameEvent[];
} 