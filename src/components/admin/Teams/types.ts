export interface Player {
  id: number;
  name: string;
  number: string;
  position: string;
  yellowCards: number;
  redCards: number;
  suspended: boolean;
  photo?: string;
}

export interface Team {
  id: number;
  name: string;
  category: string;
  modality: string;
  players: Player[];
  awards: string[];
} 