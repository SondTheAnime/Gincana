export interface VolleyballSet {
  id: number
  game_id: number
  set_number: number
  score_a: number
  score_b: number
  winner: 'A' | 'B' | null
  status: 'not_started' | 'in_progress' | 'finished'
  created_at: string
  updated_at: string
}

export interface VolleyballGameDetails {
  id: number
  game_id: number
  current_set: number
  points_a: number
  points_b: number
  timeouts_a: number
  timeouts_b: number
  created_at: string
  updated_at: string
}

export interface VolleyballGameConfig {
  id: number
  game_id: number
  total_sets: number
  points_per_set: number
  points_last_set: number
  min_difference: number
  max_timeouts: number
  max_substitutions: number
  created_at: string
  updated_at: string
}

export interface GameEvent {
  id: number
  game_id: number
  type: 'point' | 'timeout' | 'substitution'
  team: 'A' | 'B'
  player_id?: number
  description?: string
  created_at: string
  updated_at: string
}

export interface VolleyballGame {
  id: number
  sport: string
  category: string
  team_a: number
  team_b: number
  team_a_name: string
  team_b_name: string
  period: 'not_started' | 'in_progress' | 'finished'
  game_time: string
  details: VolleyballGameDetails
  config: VolleyballGameConfig
  sets: VolleyballSet[]
  highlights?: GameEvent[]
  created_at: string
  updated_at: string
} 