import { Team as BaseTeam, Player as BasePlayer, Award } from '../../types';

export interface VoleiStats {
  points: number;        // Pontos totais
  aces: number;         // Saques diretos
  blocks: number;       // Bloqueios
  kills: number;        // Ataques certeiros
  digs: number;        // Defesas
  assists: number;      // Levantamentos
  faults: number;      // Erros
  reception_errors: number;  // Erros de recepção
  service_errors: number;    // Erros de saque
  attack_errors: number;     // Erros de ataque
  block_errors: number;      // Erros de bloqueio
}

export interface VoleiPlayer extends BasePlayer {
  position: 'Levantador' | 'Oposto' | 'Ponteiro' | 'Central' | 'Líbero';
  stats: VoleiStats;
}

export interface VoleiTeam extends BaseTeam {
  coach?: string;
  assistant_coach?: string;
  home_court?: string;
  players: VoleiPlayer[];
  formation?: '5-1' | '4-2' | '6-2';
}

export type { Award };
