import { Shield, Trophy, Edit, Users } from 'lucide-react';
import { FutsalTeam, Award } from './types';

interface FutsalTeamsListProps {
  teams: FutsalTeam[];
  selectedTeam: FutsalTeam | null;
  onSelectTeam: (team: FutsalTeam) => void;
  onEditTeam: (team: FutsalTeam) => void;
}

const FutsalTeamsList = ({ teams, selectedTeam, onSelectTeam, onEditTeam }: FutsalTeamsListProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-6">
      <div className="flex items-center space-x-2 mb-3 sm:mb-4">
        <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Times de Futsal</h3>
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
                  <span>{team.formation || '3-1'}</span>
                  {team.coach && (
                    <>
                      <span>•</span>
                      <span>Técnico: {team.coach}</span>
                    </>
                  )}
                </div>
                {team.home_court && (
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Quadra: {team.home_court}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span>{team.players?.length || 0}</span>
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
            {team.awards?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
                {team.awards.map((award: Award) => (
                  <div
                    key={award.id}
                    className="bg-yellow-100 dark:bg-yellow-900 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md flex items-center space-x-1"
                  >
                    <Trophy className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-yellow-700 dark:text-yellow-300 text-xs">
                      {award.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {teams.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nenhum time de futsal cadastrado
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FutsalTeamsList; 