export type GameStatus = 'scheduled' | 'live' | 'finished'

export interface GameEvent {
  id: number
  game_id: number
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'timeout' | 'point'
  team: 'A' | 'B'
  player_id?: number
  description?: string
  created_at: string
  updated_at: string
}

export interface Game {
  id: number
  sport: string
  category: string
  team_a: number
  team_b: number
  player_a?: number
  player_b?: number
  score_a: number
  score_b: number
  date: string
  time: string
  game_time: string
  period: 'not_started' | 'in_progress' | 'finished'
  location: string
  status: GameStatus
  team_a_name: string
  team_b_name: string
  highlights?: GameEvent[]
  created_at: string
  updated_at: string
}

export interface Player {
  id: number
  name: string
  team_id: number
  number: number
  position?: string
  goals: number
  yellow_cards: number
  red_cards: number
  created_at: string
  updated_at: string
} 