import { Shield, UserPlus, AlertTriangle, User, Edit, Trash2 } from 'lucide-react';
import { Team, Player } from './types';

interface TeamDetailsProps {
  selectedTeam: Team | null;
  onAddPlayer: () => void;
  onEditPlayer: (player: Player) => void;
}

const TeamDetails = ({ selectedTeam, onAddPlayer, onEditPlayer }: TeamDetailsProps) => {
  if (!selectedTeam) {
    return (
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Selecione um time para ver os detalhes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0 mb-4 sm:mb-6">
        <div className="flex items-center space-x-3">
          <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{selectedTeam.name}</h3>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <span>{selectedTeam.category}</span>
              <span>•</span>
              <span>{selectedTeam.modality}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onAddPlayer}
          className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-3 py-2 rounded-md text-xs sm:text-sm transition-colors w-full sm:w-auto"
        >
          <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Adicionar Jogador</span>
        </button>
      </div>

      {/* Players List */}
      <div className="space-y-3 sm:space-y-4">
        {selectedTeam.players.map(player => (
          <div
            key={player.id}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 dark:bg-green-800 h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center overflow-hidden">
                  {player.photo ? (
                    <img 
                      src={player.photo} 
                      alt={player.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{player.name}</p>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <span>#{player.number}</span>
                    <span>•</span>
                    <span>{player.position}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                {/* Status Indicators */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {player.yellowCards > 0 && (
                    <div className="bg-yellow-100 dark:bg-yellow-900 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                      <span className="text-yellow-700 dark:text-yellow-300 text-xs sm:text-sm">
                        {player.yellowCards} CA
                      </span>
                    </div>
                  )}
                  {player.redCards > 0 && (
                    <div className="bg-red-100 dark:bg-red-900 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                      <span className="text-red-700 dark:text-red-300 text-xs sm:text-sm">
                        {player.redCards} CV
                      </span>
                    </div>
                  )}
                  {player.suspended && (
                    <div className="bg-gray-100 dark:bg-gray-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md flex items-center space-x-1">
                      <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">Suspenso</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <button 
                    onClick={() => onEditPlayer(player)}
                    className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                    aria-label="Editar jogador"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <button 
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    aria-label="Remover jogador"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamDetails; 