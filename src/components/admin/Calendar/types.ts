export interface Team {
  id: number;
  name: string;
  modality: string;
  category: string;
}

export interface Match {
  id: number;
  date: string;
  time: string;
  sport: string;
  team_a: number;
  team_b: number;
  team_a_name?: string;
  team_b_name?: string;
  location: string;
  category: string;
  status: 'scheduled' | 'live' | 'finished' | 'cancelled';
} 