import { Shield, UserPlus, User, Edit, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BasketballTeam, BasketballPlayer } from './types';
import PlayerStatsModal from './PlayerStatsModal';

interface BasketballTeamDetailsProps {
  selectedTeam: BasketballTeam | null;
  onAddPlayer: () => void;
  onEditPlayer: (player: BasketballPlayer) => void;
  onToggleStarter: (player: BasketballPlayer) => void;
  onToggleCaptain: (player: BasketballPlayer) => void;
}

const BasketballTeamDetails = ({
  selectedTeam,
  onAddPlayer,
  onEditPlayer,
  onToggleStarter,
  onToggleCaptain
}: BasketballTeamDetailsProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<BasketballPlayer | null>(null);

  useEffect(() => {
    if (selectedPlayer && selectedTeam) {
      const updatedPlayer = selectedTeam.players.find(p => p.id === selectedPlayer.id);
      setSelectedPlayer(updatedPlayer || null);
    }
  }, [selectedTeam, selectedTeam?.players]);

  if (!selectedTeam) {
    return (
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Selecione um time para ver os detalhes
          </p>
        </div>
      </div>
    );
  }

  const starters = selectedTeam.players.filter(player => player.is_starter);
  const substitutes = selectedTeam.players.filter(player => !player.is_starter);

  const renderPlayerCard = (player: BasketballPlayer) => (
    <div
      key={player.id}
      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      onClick={() => setSelectedPlayer(player)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 dark:bg-green-800 h-12 w-12 rounded-full flex items-center justify-center overflow-hidden relative">
            {player.photo ? (
              <img 
                src={player.photo} 
                alt={player.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-green-600 dark:text-green-400" />
            )}
            {player.is_captain && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                <Star className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <span>{player.name}</span>
              {player.is_captain && (
                <span className="text-xs text-yellow-600 dark:text-yellow-400">(Capitão)</span>
              )}
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <span>#{player.number}</span>
                <span>•</span>
                <span>{player.position}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleStarter(player);
            }}
            className={`px-2 py-1 text-xs rounded-md transition-colors ${
              player.is_starter
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
            }`}
          >
            {player.is_starter ? 'Titular' : 'Reserva'}
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleCaptain(player);
            }}
            className={`p-1 rounded-md transition-colors ${
              player.is_captain
                ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400'
                : 'text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400'
            }`}
            aria-label={player.is_captain ? 'Remover Capitão' : 'Definir como Capitão'}
          >
            <Star className="h-4 w-4" />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEditPlayer(player);
            }}
            className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
            aria-label="Editar jogador"
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <div className="text-gray-500 dark:text-gray-400">Pontos</div>
          <div className="font-medium text-gray-900 dark:text-white">
            {player.stats.points}
          </div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400">Assistências</div>
          <div className="font-medium text-gray-900 dark:text-white">
            {player.stats.assists}
          </div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400">Rebotes</div>
          <div className="font-medium text-gray-900 dark:text-white">
            {player.stats.rebounds}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedTeam.name}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{selectedTeam.category}</span>
                <span>•</span>
                <span>{selectedTeam.formation}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onAddPlayer}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Adicionar Jogador</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 text-center text-sm">
          <div>
            <div className="text-gray-500 dark:text-gray-400">Técnico</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {selectedTeam.coach}
            </div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400">Auxiliar</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {selectedTeam.assistant_coach || '-'}
            </div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400">Ginásio</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {selectedTeam.home_court || '-'}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {starters.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Titulares ({starters.length})
              </h4>
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                {starters.map(player => renderPlayerCard(player))}
              </div>
            </div>
          )}

          {substitutes.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Reservas ({substitutes.length})
              </h4>
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                {substitutes.map(player => renderPlayerCard(player))}
              </div>
            </div>
          )}

          {selectedTeam.players.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum jogador cadastrado
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedPlayer && (
        <PlayerStatsModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </>
  );
};

export default BasketballTeamDetails;
