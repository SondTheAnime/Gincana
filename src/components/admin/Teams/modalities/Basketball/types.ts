import { Team as BaseTeam, Player as BasePlayer, Award } from '../../types';

export interface BasketballStats {
  minutes_played: number;  // Minutos jogados
  points: number;         // Pontos totais
  assists: number;        // Assistências
  rebounds: number;       // Rebotes
  steals: number;         // Roubos de bola
  blocks: number;         // Tocos
  fouls: number;         // Faltas
  turnovers: number;      // Turnovers
  three_pointers: number; // Cestas de 3 pontos
  free_throws: number;    // Lances livres
  field_goals: number;    // Arremessos de campo
}

export interface BasketballPlayer extends BasePlayer {
  position: 'Armador' | 'Ala-Armador' | 'Ala' | 'Ala-Pivô' | 'Pivô';
  stats: BasketballStats;
}

export interface BasketballTeam extends BaseTeam {
  coach?: string;
  assistant_coach?: string;
  home_court?: string;
  players: BasketballPlayer[];
  formation?: '1-2-2' | '2-1-2' | '3-2' | '2-3' | '1-3-1';
  awards?: Award[];
}

export type { Award };
