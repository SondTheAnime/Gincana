import { Shield, Trophy, Edit, Users } from 'lucide-react';
import { VoleiTeam } from './types';

interface VoleiTeamsListProps {
  teams: VoleiTeam[];
  selectedTeam: VoleiTeam | null;
  onSelectTeam: (team: VoleiTeam) => void;
  onEditTeam: (team: VoleiTeam) => void;
}

const VoleiTeamsList = ({
  teams,
  selectedTeam,
  onSelectTeam,
  onEditTeam
}: VoleiTeamsListProps) => {
  if (teams.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <Shield className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          Nenhum time de Vôlei cadastrado
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {teams.map((team) => (
        <div
          key={team.id}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 cursor-pointer transition-colors ${
            selectedTeam?.id === team.id
              ? 'ring-2 ring-green-500 dark:ring-green-400'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          onClick={() => onSelectTeam(team)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {team.name}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{team.category}</span>
                  <span>•</span>
                  <span>{team.formation}</span>
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditTeam(team);
              }}
              className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
              aria-label="Editar time"
            >
              <Edit className="h-5 w-5" />
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
                  {team.players.reduce((total, player) => total + player.stats.points, 0)} pontos
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VoleiTeamsList;
