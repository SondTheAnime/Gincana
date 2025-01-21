export type GameStatus = 'scheduled' | 'live' | 'finished' | 'cancelled';
export type EventType = 'goal' | 'yellow_card' | 'red_card' | 'substitution';
export type GamePeriod = 'not_started' | 'in_progress' | 'finished';

export interface Team {
  id: number;
  name: string;
  modality: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export interface Player {
  id: number;
  name: string;
  number: number;
  team_id: number;
  photo?: string;
  goals: number;
  yellow_cards: number;
  red_cards: number;
  created_at?: string;
  updated_at?: string;
}

export interface GameEvent {
  id?: number;
  game_id: number;
  created_at: string;
  player_id: number;
  team: 'A' | 'B';
  type: EventType;
  description?: string;
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
  period?: GamePeriod;
  highlights?: GameEvent[];
  created_at?: string;
  updated_at?: string;
}

export interface CalendarFilters {
  sport?: string;
  category?: string;
  location?: string;
  status?: string;
} 