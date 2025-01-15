import { Team as BaseTeam, Player as BasePlayer, Award } from '../../types';

export interface FutsalStats {
  assists: number;
  saves?: number; // Para goleiros
  clean_sheets?: number; // Para goleiros
  minutes_played: number;
  fouls_committed: number;
  fouls_suffered: number;
  yellow_cards: number;
  red_cards: number;
  goals: number;
}

export interface FutsalPlayer extends BasePlayer {
  position: 'Goleiro' | 'Fixo' | 'Ala Direita' | 'Ala Esquerda' | 'Pivô';
  stats: FutsalStats;
}

export interface FutsalTeam extends BaseTeam {
  coach?: string;
  assistant_coach?: string;
  home_court?: string;
  players: FutsalPlayer[];
  formation?: string;
}

export type { Award }; 