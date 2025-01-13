export type SportType = string;
export type CategoryType = 'Masculino' | 'Feminino' | 'Misto';

export interface Modality {
  id: number;
  name: string;
  icon: string;
  description: string;
  is_team_sport: boolean;
  is_active: boolean;
}

export interface Team {
  id: number;
  name: string;
  modality: SportType;
  category: CategoryType;
  created_at?: string;
  updated_at?: string;
}

export interface Player {
  id: number;
  name: string;
  number: number;
  team_id: number;
  photo?: string;
  goals: number;
  yellow_cards: number;
  red_cards: number;
  is_starter: boolean;
  is_captain: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Award {
  id: number;
  team_id: number;
  title: string;
  description?: string;
  date: string;
  created_at?: string;
  updated_at?: string;
} 