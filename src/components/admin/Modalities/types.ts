export interface Modality {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  max_players?: number;
  min_players?: number;
  is_team_sport: boolean;
}

export interface CreateModalityInput {
  name: string;
  description: string;
  is_active?: boolean;
  max_players?: number;
  min_players?: number;
  is_team_sport: boolean;
}

export interface UpdateModalityInput extends Partial<CreateModalityInput> {
  id: string;
} 