export interface CreateGameProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export interface Player {
  id: number
  name: string
  team_id: number
  team_name: string
}

export interface Team {
  id: number
  name: string
  modality: string
  category: string
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
  config: GameConfig
}

export interface GameConfig {
  total_sets: number
  points_per_set: number
  points_last_set?: number
  min_difference: number
  max_timeouts?: number
  max_substitutions?: number
}

export type StepProps = {
  formData: GameFormData
  setFormData: (data: GameFormData) => void
  loading?: boolean
}