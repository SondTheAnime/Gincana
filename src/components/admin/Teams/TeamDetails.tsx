import { Shield, UserPlus, User, Edit, Trash2, Star } from 'lucide-react';
import { Team, Player } from './types';

interface TeamDetailsProps {
  selectedTeam: Team | null;
  players: Player[];
  onAddPlayer: () => void;
  onEditPlayer: (player: Player) => void;
  onDeletePlayer?: (player: Player) => void;
  onToggleStarter?: (player: Player) => void;
  onToggleCaptain?: (player: Player) => void;
}

const TeamDetails = ({ 
  selectedTeam, 
  players, 
  onAddPlayer, 
  onEditPlayer, 
  onDeletePlayer,
  onToggleStarter,
  onToggleCaptain 
}: TeamDetailsProps) => {
  const starters = players.filter(player => player.is_starter);
  const substitutes = players.filter(player => !player.is_starter);

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

  const renderPlayerCard = (player: Player) => (
    <div
      key={player.id}
      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 dark:bg-green-800 h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center overflow-hidden relative">
            {player.photo ? (
              <img 
                src={player.photo} 
                alt={player.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
            )}
            {player.is_captain && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                <Star className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <span>{player.name}</span>
              {player.is_captain && (
                <span className="text-xs text-yellow-600 dark:text-yellow-400">(Capitão)</span>
              )}
            </p>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <span>#{player.number}</span>
              <span>•</span>
              <span>⚽ {player.goals}</span>
              <span>•</span>
              <span>🟨 {player.yellow_cards}</span>
              <span>•</span>
              <span>🟥 {player.red_cards}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {onToggleStarter && (
            <button 
              onClick={() => onToggleStarter(player)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                player.is_starter
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
              }`}
            >
              {player.is_starter ? 'Titular' : 'Reserva'}
            </button>
          )}
          {onToggleCaptain && (
            <button 
              onClick={() => onToggleCaptain(player)}
              className={`p-1 rounded-md transition-colors ${
                player.is_captain
                  ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400'
                  : 'text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400'
              }`}
              aria-label={player.is_captain ? 'Remover Capitão' : 'Definir como Capitão'}
            >
              <Star className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          )}
          <button 
            onClick={() => onEditPlayer(player)}
            className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
            aria-label="Editar jogador"
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          {onDeletePlayer && (
            <button 
              onClick={() => onDeletePlayer(player)}
              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              aria-label="Remover jogador"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

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

      {/* Titulares */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Titulares ({starters.length})
        </h4>
        <div className="space-y-3">
          {starters.map(renderPlayerCard)}
          {starters.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              Nenhum titular definido
            </p>
          )}
        </div>
      </div>

      {/* Reservas */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Reservas ({substitutes.length})
        </h4>
        <div className="space-y-3">
          {substitutes.map(renderPlayerCard)}
          {substitutes.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              Nenhum reserva definido
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetails; 