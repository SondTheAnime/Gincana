import { GameConfig } from './types'

export const defaultConfigs: Record<string, GameConfig> = {
  'Vôlei': {
    total_sets: 3,
    points_per_set: 25,
    points_last_set: 15,
    min_difference: 2,
    max_timeouts: 2,
    max_substitutions: 6
  },
  'Tênis de Mesa': {
    total_sets: 7,
    points_per_set: 11,
    min_difference: 2,
    max_timeouts: 1
  }
}