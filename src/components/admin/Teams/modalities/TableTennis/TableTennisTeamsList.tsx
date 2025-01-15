import { Users, Trophy, Pencil, Shield } from 'lucide-react';
import { TableTennisTeam } from './types';

interface TableTennisTeamsListProps {
  teams: TableTennisTeam[];
  selectedTeam: TableTennisTeam | null;
  onSelectTeam: (team: TableTennisTeam) => void;
  onEditTeam: (team: TableTennisTeam) => void;
}

const TableTennisTeamsList = ({
  teams,
  selectedTeam,
  onSelectTeam,
  onEditTeam,
}: TableTennisTeamsListProps) => {
  if (teams.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <Shield className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          Nenhum time de Tenis de Mesa cadastrado
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {teams.map((team) => (
        <div
          key={team.id}
          className={`cursor-pointer rounded-lg border p-4 transition-colors ${
            selectedTeam?.id === team.id
              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950'
              : 'border-gray-200 bg-white hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600'
          }`}
          onClick={() => onSelectTeam(team)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {team.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {team.category}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditTeam(team);
              }}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <Pencil className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-gray-500 dark:text-gray-400">Técnico</div>
              <div className="font-medium text-gray-900 dark:text-white truncate">
                {team.coach}
              </div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Quadra</div>
              <div className="font-medium text-gray-900 dark:text-white truncate">
                {team.home_court}
              </div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Jogadores</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {team.players.length}
              </div>
            </div>
          </div>

          {team.players.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">
                  {team.players.length} jogadores
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-gray-500 dark:text-gray-400">
                  {team.awards?.length || 0} premios
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TableTennisTeamsList;
