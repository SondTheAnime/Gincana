export interface GameEvent {
  created_at: string
  player_id: number
  team: 'A' | 'B'
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution'
}

export interface Game {
  id: number
  sport: string
  team_a: number
  team_b: number
  team_a_name: string
  team_b_name: string
  score_a: number
  score_b: number
  date: string
  time: string
  game_time: string
  period: string
  location: string
  category: string
  status: 'scheduled' | 'live' | 'finished' | 'cancelled'
  highlights?: GameEvent[]
}

export interface Player {
  id: number
  name: string
  number: number
  team_id: number
  photo?: string
  goals: number
  yellow_cards: number
  red_cards: number
  position?: string
  is_starter?: boolean
  is_captain: boolean
}

export interface TeamLineup {
  team_id: number
  team_name: string
  players: Player[]
}

export interface GameStats {
  player_id: number
  game_id: number
  goals: number
  assists: number
  yellow_cards: number
  red_cards: number
  minutes_played: number
  team: 'A' | 'B'
} 