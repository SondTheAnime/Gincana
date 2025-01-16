import { useState } from 'react';
import { TableTennisTeam, TableTennisPlayer } from './types';
import { supabase } from '../../../../../lib/supabase';
import { toast } from 'react-toastify';
import TableTennisTeamModals from './TableTennisTeamModals';
import TableTennisTeamsList from './TableTennisTeamsList';
import TableTennisTeamDetails from './TableTennisTeamDetails';
import { BaseManageTeams } from '../base/BaseManageTeams';

const POSITIONS = ['Destro', 'Canhoto', 'Ambidestro'] as const;

const ManageTableTennisTeams = () => {
  const [teams, setTeams] = useState<TableTennisTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TableTennisTeam | null>(null);

  const mapTeamData = (data: any): TableTennisTeam => ({
    ...data,
    players: data.players?.map((player: any) => mapPlayerData(player)) || []
  });

  const mapPlayerData = (data: any): TableTennisPlayer => ({
    ...data,
    position: data.position || POSITIONS[0],
    is_starter: data.is_starter || false,
    is_captain: data.is_captain || false,
    grip_style: data.grip || data.grip_style || 'Clássica',
    grip: data.grip || data.grip_style || 'Clássica',
    play_style: data.style || 'All-around',
    style: data.style || 'All-around',
    stats: {
      minutes_played: data.stats?.minutes_played || 0,
      matches_played: data.stats?.matches_played || 0,
      matches_won: data.stats?.matches_won || 0,
      matches_lost: data.stats?.matches_lost || 0,
      sets_won: data.stats?.sets_won || 0,
      sets_lost: data.stats?.sets_lost || 0,
      points_won: data.stats?.points_won || 0,
      points_lost: data.stats?.points_lost || 0,
      aces: data.stats?.aces || 0,
      unforced_errors: data.stats?.unforced_errors || 0,
      winners: data.stats?.winners || 0
    }
  });

  const handleDeleteTeam = async (teamId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este time? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      // Primeiro, excluir todas as solicitações de jogadores associadas ao time
      const { error: requestsError } = await supabase
        .from('player_requests')
        .delete()
        .eq('team_id', teamId);

      if (requestsError) throw requestsError;

      // Depois, excluir o time
      const { error: teamError } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (teamError) throw teamError;

      const updatedTeams = teams.filter(team => team.id !== teamId);
      setTeams(updatedTeams);
      
      if (selectedTeam?.id === teamId) {
        setSelectedTeam(null);
      }

      toast.success('Time excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir time:', error);
      toast.error('Erro ao excluir time. Tente novamente.');
    }
  };

  return (
    <BaseManageTeams<TableTennisTeam, TableTennisPlayer>
      modality="Tênis de Mesa"
      TeamsList={TableTennisTeamsList}
      TeamDetails={TableTennisTeamDetails}
      TeamModals={TableTennisTeamModals}
      positions={POSITIONS}
      formations={[]}
      defaultPlayerStats={{
        minutes_played: 0,
        matches_played: 0,
        matches_won: 0,
        matches_lost: 0,
        sets_won: 0,
        sets_lost: 0,
        points_won: 0,
        points_lost: 0,
        aces: 0,
        unforced_errors: 0,
        winners: 0
      }}
      mapTeamData={mapTeamData}
      mapPlayerData={mapPlayerData}
      onDeleteTeam={handleDeleteTeam}
    />
  );
};

export default ManageTableTennisTeams;
