// Tipos base para estatísticas de jogador
export interface BasePlayerStats {
  minutes_played: number;
}

// Interface base para jogador
export interface BasePlayer {
  id: number;
  name: string;
  number: number;
  photo?: string;
  position: string;
  team_id: number;
  is_starter: boolean;
  is_captain: boolean;
  stats: BasePlayerStats;
  style?: string;
  grip?: string;
}

// Interface base para time
export interface BaseTeam {
  id: number;
  name: string;
  category: 'Masculino' | 'Feminino' | 'Misto';
  modality: string;
  coach?: string;
  assistant_coach?: string;
  home_court?: string;
  formation?: string;
  players: BasePlayer[];
}

// Interface base para listas de times
export interface BaseTeamsListProps<T> {
  teams: T[];
  selectedTeam: T | null;
  onSelectTeam: (team: T) => void;
  onEditTeam: (team: T) => void;
}

// Interface base para detalhes do time
export interface BaseTeamDetailsProps<T, P> {
  selectedTeam: T | null;
  onAddPlayer: () => void;
  onEditPlayer: (player: P) => void;
  onToggleStarter: (player: P) => void;
  onToggleCaptain: (player: P) => void;
  players: P[];
  setPlayers: (players: P[]) => void;
}

// Interface base para modais
export interface BaseTeamModalsProps<T, P> {
  isAddingTeam: boolean;
  isAddingPlayer: boolean;
  isEditingPlayer: boolean;
  isEditingTeam: boolean;
  editingPlayer: P | null;
  editingTeam: T | null;
  newTeam: Partial<T>;
  newPlayer: Partial<P>;
  onCloseAddTeam: () => void;
  onCloseAddPlayer: () => void;
  onCloseEditPlayer: () => void;
  onCloseEditTeam: () => void;
  onSubmitTeam: (e: React.FormEvent) => void;
  onSubmitPlayer: (e: React.FormEvent) => void;
  onUpdatePlayer: (e: React.FormEvent) => void;
  onUpdateTeam: (e: React.FormEvent) => void;
  onChangeNewTeam: (field: string, value: any) => void;
  onChangeNewPlayer: (field: string, value: any) => void;
  onChangeEditingPlayer: (field: string, value: any) => void;
  onChangeEditingTeam: (field: string, value: any) => void;
  positions: readonly string[];
  formations: readonly string[];
  onDeleteTeam: (teamId: number) => void;
}

// Interface base para modal de estatísticas do jogador
export interface BasePlayerStatsModalProps<P> {
  player: P;
  onClose: () => void;
}

// Tipo base para premiações
export interface Award {
  id: number;
  title: string;
  description: string;
  team_id: number;
  player_id?: number;
  date: string;
  type: 'team' | 'player';
}
