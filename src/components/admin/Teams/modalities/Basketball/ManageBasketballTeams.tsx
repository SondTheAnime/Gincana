import { BasketballTeam, BasketballPlayer } from './types';
import {BaseManageTeams} from '../base/BaseManageTeams';
import BasketballTeamDetails from './BasketballTeamDetails';
import BasketballTeamModals from './BasketballTeamModals';
import BasketballTeamsList from './BasketballTeamsList';

const POSITIONS = ['Armador', 'Ala-Armador', 'Ala', 'Ala-Pivô', 'Pivô'] as const;
const FORMATIONS = ['1-2-2', '2-1-2', '3-2', '2-3'] as const;

const ManageBasketballTeams = () => {
  const mapTeamData = (data: any): BasketballTeam => ({
    ...data,
    players: data.players || []
  });

  const mapPlayerData = (data: any): BasketballPlayer => ({
    ...data,
    is_starter: data.is_starter || false,
    is_captain: data.is_captain || false,
    stats: {
      minutes_played: data.stats?.minutes_played || 0,
      points: data.stats?.points || 0,
      assists: data.stats?.assists || 0,
      rebounds: data.stats?.rebounds || 0,
      steals: data.stats?.steals || 0,
      blocks: data.stats?.blocks || 0,
      fouls: data.stats?.fouls || 0,
      turnovers: data.stats?.turnovers || 0,
      three_pointers: data.stats?.three_pointers || 0,
      free_throws: data.stats?.free_throws || 0,
      field_goals: data.stats?.field_goals || 0
    }
  });

  return (
    <BaseManageTeams
      modality="Basquete"
      TeamsList={BasketballTeamsList}
      TeamDetails={BasketballTeamDetails}
      TeamModals={BasketballTeamModals}
      positions={POSITIONS}
      formations={FORMATIONS}
      defaultPlayerStats={{
        minutes_played: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0,
        fouls: 0,
        turnovers: 0,
        three_pointers: 0,
        free_throws: 0,
        field_goals: 0
      }}
      mapTeamData={mapTeamData}
      mapPlayerData={mapPlayerData}
    />
  );
};

export default ManageBasketballTeams;
