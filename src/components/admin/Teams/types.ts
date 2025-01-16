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

export interface BaseTeam {
  id: number;
  name: string;
  modality: SportType;
  category: CategoryType;
  created_at?: string;
  updated_at?: string;
}

export interface BasePlayer {
  id: number;
  name: string;
  number: number;
  team_id: number;
  photo?: string;
  is_starter: boolean;
  is_captain: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Team extends BaseTeam {}

export interface Player extends BasePlayer {
}

export interface VoleiStats {
  points: number;
  aces: number;
  blocks: number;
  kills: number;
  digs: number;
  assists: number;
  faults: number;
  reception_errors: number;
  service_errors: number;
  attack_errors: number;
  block_errors: number;
}

export interface VoleiPlayer extends BasePlayer {
  position: 'Levantador' | 'Ponteiro' | 'Oposto' | 'Central' | 'Líbero';
  stats: VoleiStats;
}

export interface VoleiTeam extends BaseTeam {
  coach: string;
  assistant_coach?: string;
  home_court: string;
  players: VoleiPlayer[];
}

export interface FutsalStats {
  goals: number;
  assists: number;
  saves: number;
  clean_sheets: number;
  minutes_played: number;
  fouls_committed: number;
  fouls_suffered: number;
  yellow_cards: number;
  red_cards: number;
}

export interface FutsalPlayer extends BasePlayer {
  position: 'Goleiro' | 'Fixo' | 'Ala Direita' | 'Ala Esquerda' | 'Pivô';
  stats: FutsalStats;
}

export interface FutsalTeam extends BaseTeam {
  coach: string;
  assistant_coach?: string;
  home_court: string;
  players: FutsalPlayer[];
  formation?: '1-2-1' | '2-2' | '3-1' | '4-0';
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