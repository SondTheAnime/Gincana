import { Team as BaseTeam, Player as BasePlayer, Award } from '../../types';
import { BasePlayerStats } from '../base/types';

export interface TableTennisStats extends BasePlayerStats {
  minutes_played: number;    // Minutos jogados
  matches_played: number;    // Total de partidas jogadas
  matches_won: number;       // Total de partidas vencidas
  matches_lost: number;      // Total de partidas perdidas
  sets_won: number;         // Total de sets vencidos
  sets_lost: number;        // Total de sets perdidos
  points_won: number;       // Total de pontos ganhos
  points_lost: number;      // Total de pontos perdidos
  aces: number;            // Saques diretos
  unforced_errors: number; // Erros não forçados
  winners: number;         // Winners (pontos diretos)
}

export interface TableTennisPlayer extends BasePlayer {
  position: 'Destro' | 'Canhoto' | 'Ambidestro';
  grip_style?: 'Clássica' | 'Caneta' | 'Híbrida';  // Estilo de empunhadura
  play_style?: 'Ofensivo' | 'Defensivo' | 'All-around';  // Estilo de jogo
  stats: TableTennisStats;
}

export interface TableTennisTeam extends BaseTeam {
  coach?: string;
  assistant_coach?: string;
  home_court?: string;
  players: TableTennisPlayer[];
  awards?: Award[];
}

export type { Award };
