import { Game, GameSet } from '../../../Games/CreateGame/types'

export interface VolleyballGame extends Omit<Game, 'highlights'> {
  sets: VolleyballSet[]
  config: VolleyballConfig
  highlights: VolleyballEvent[]
  details: VolleyballDetails
}

export interface VolleyballSet extends GameSet {
  score_a: number
  score_b: number
  status: 'not_started' | 'in_progress' | 'finished'
  winner?: 'A' | 'B'
}

export interface VolleyballConfig {
  total_sets: number
  points_per_set: number
  points_last_set: number
  min_difference: number
  max_timeouts: number
  max_substitutions: number
}

export interface VolleyballDetails {
  id: number
  game_id: number
  current_set: number
  points_a: number
  points_b: number
  timeouts_a: number
  timeouts_b: number
  created_at?: string
  updated_at?: string
}

export interface VolleyballEvent {
  id: number
  game_id: number
  type: 'point' | 'timeout' | 'substitution'
  team: 'A' | 'B'
  player_id?: number
  description?: string
  created_at: string
  updated_at: string
  point_type?: 'attack' | 'block' | 'ace' | 'opponent_error'
}

export interface VolleyballStats {
  id?: number
  game_id: number
  team: 'A' | 'B'
  player_id: number
  points: number
  aces: number
  blocks: number
  created_at?: string
  updated_at?: string
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
  type: string
  team: string
  player_id?: number
  description: string
  created_at: string
  updated_at: string
  point_type?: 'attack' | 'block' | 'ace' | 'opponent_error'
} 