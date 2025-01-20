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
  status: 'scheduled' | 'live' | 'finished'
  team_a_name: string
  team_b_name: string
  created_at: string
  updated_at: string
}

export interface GameSet {
  id: number
  game_id: number
  set_number: number
  created_at?: string
  updated_at?: string
}

export interface StepProps {
  formData: GameFormData
  setFormData: (data: GameFormData) => void
}

export interface GameFormData {
  sport: string
  category: string
  team_a: number
  team_b: number
  player_a?: number
  player_b?: number
  date: string
  time: string
  location: string
  config: any
}

export interface Team {
  id: number
  name: string
  modality: string
  category: string
  created_at: string
  updated_at: string
}

export interface Player {
  id: number
  name: string
  team_id: number
  team_name: string
}

export interface CreateGameProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export interface GameConfig {
  total_sets: number
  points_per_set: number
  points_last_set?: number
  min_difference: number
  max_timeouts?: number
  max_substitutions?: number
}