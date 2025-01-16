import { TableTennisTeam, TableTennisPlayer } from './types';
import { BaseManageTeams } from '../base/BaseManageTeams';
import TableTennisTeamDetails from './TableTennisTeamDetails';
import TableTennisTeamModals from './TableTennisTeamModals';
import TableTennisTeamsList from './TableTennisTeamsList';

const POSITIONS = ['Destro', 'Canhoto', 'Ambidestro'] as const;

const ManageTableTennisTeams = () => {

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
    />
  );
};

export default ManageTableTennisTeams;
