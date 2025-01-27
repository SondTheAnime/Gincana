export interface GameEvent {
  created_at: string
  player_id: number
  team: 'A' | 'B'
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution'
}

export interface Highlight {
  created_at: string
  type: string
  description: string
  team: 'A' | 'B'
}

export interface GameConfig {
  id: number
  game_id: number
  total_sets: number
  points_per_set: number
  points_last_set?: number
  min_difference: number
  max_timeouts?: number
  max_substitutions?: number
  created_at: string
  updated_at: string
}

export interface Set {
  number: number
  score_a: number
  score_b: number
  winner?: 'A' | 'B'
  status: 'not_started' | 'in_progress' | 'finished'
}

export interface VolleyballGameData {
  sets: Set[]
  current_set: number
  points_a: number
  points_b: number
  timeouts_a: number
  timeouts_b: number
}

export interface TableTennisGameData {
  sets: Set[]
  current_set: number
  points_a: number
  points_b: number
  serves_left: number
  server: 'A' | 'B'
  service_points_a: number
  service_points_b: number
  return_points_a: number
  return_points_b: number
  errors_a: number
  errors_b: number
}

export interface BaseGame {
  id: number
  sport: string
  category: 'masculino' | 'feminino' | 'misto'
  team_a: number
  team_b: number
  score_a: number
  score_b: number
  date: string
  time: string
  game_time: string
  period: 'not_started' | 'in_progress' | 'finished'
  location: string
  status: 'scheduled' | 'live' | 'finished'
  team_a_name: string
  team_b_name: string
  highlights: Highlight[]
}

export interface Game extends BaseGame {
  table_tennis_data?: TableTennisGameData
  config: GameConfig
  volleyball_data?: VolleyballData
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

interface VolleyballSet {
  number: number
  score_a: number
  score_b: number
  status: 'not_started' | 'in_progress' | 'finished'
  winner?: 'A' | 'B'
}

export interface VolleyballData {
  sets: VolleyballSet[]
  details: {
    timeouts_a: number
    timeouts_b: number
    points_a: number
    points_b: number
    current_set: number
  }
  config: {
    max_timeouts: number
    points_per_set: number
    points_last_set: number
    total_sets: number
  }
} 