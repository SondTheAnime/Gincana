import { Game, GameSet } from '../../../Games/CreateGame/types'

export interface TableTennisGame extends Omit<Game, 'highlights'> {
  sets: TableTennisSet[]
  config: TableTennisConfig
  highlights: TableTennisEvent[]
  details: TableTennisDetails
  winner?: 'A' | 'B'
}

export interface TableTennisSet extends GameSet {
  score_a: number
  score_b: number
  status: 'not_started' | 'in_progress' | 'finished'
  winner?: 'A' | 'B'
}

export interface TableTennisConfig {
  total_sets: number
  points_per_set: number
  min_difference: number
  max_timeouts: number
}

export interface TableTennisDetails {
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

export interface TableTennisEvent {
  id?: number
  game_id: number
  type: 'point' | 'timeout'
  team: 'A' | 'B'
  player_id?: number
  description: string
  created_at?: string
  updated_at?: string
} 