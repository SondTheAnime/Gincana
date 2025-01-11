import { Shield, Medal, Trophy, Edit } from 'lucide-react';
import { Team } from './types';

interface TeamsListProps {
  teams: Team[];
  selectedTeam: Team | null;
  onSelectTeam: (team: Team) => void;
  onEditTeam: (team: Team) => void;
}

const TeamsList = ({ teams, selectedTeam, onSelectTeam, onEditTeam }: TeamsListProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-6">
      <div className="flex items-center space-x-2 mb-3 sm:mb-4">
        <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Times</h3>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {teams.map(team => (
          <div
            key={team.id}
            onClick={() => onSelectTeam(team)}
            className={`p-2 sm:p-3 rounded-md cursor-pointer transition-colors ${
              selectedTeam?.id === team.id
                ? 'bg-green-50 dark:bg-green-900'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
              <div>
                <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{team.name}</p>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <span>{team.category}</span>
                  <span>•</span>
                  <span>{team.modality}</span>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Medal className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {team.players.length} jogadores
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTeam(team);
                  }}
                  className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                  aria-label="Editar time"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
            {team.awards.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
                {team.awards.map((award, index) => (
                  <div
                    key={index}
                    className="bg-yellow-100 dark:bg-yellow-900 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md flex items-center space-x-1"
                  >
                    <Trophy className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-yellow-700 dark:text-yellow-300 text-xs">
                      {award}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamsList; 