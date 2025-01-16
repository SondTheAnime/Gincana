import { TableTennisTeam, TableTennisPlayer } from './types';
import { Crown, Star, UserPlus, Table2, Shield, Trash2, Loader2 } from 'lucide-react';
import PlayerStatsModal from './PlayerStatsModal';
import { useState } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { toast } from 'sonner';

interface TableTennisTeamDetailsProps {
  selectedTeam: TableTennisTeam | null;
  onAddPlayer: () => void;
  onEditPlayer: (player: TableTennisPlayer) => void;
  onToggleStarter: (player: TableTennisPlayer) => void;
  onToggleCaptain: (player: TableTennisPlayer) => void;
  players: TableTennisPlayer[];
  setPlayers: (players: TableTennisPlayer[]) => void;
}

const TableTennisTeamDetails = ({
  selectedTeam,
  onAddPlayer,
  onEditPlayer,
  onToggleStarter,
  onToggleCaptain,
  players,
  setPlayers,
}: TableTennisTeamDetailsProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<TableTennisPlayer | null>(
    null
  );
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const getWinRate = (player: TableTennisPlayer) => {
    const { matches_won, matches_played } = player.stats;
    if (!matches_played) return 0;
    return ((matches_won / matches_played) * 100).toFixed(1);
  };

  const getPointsAverage = (player: TableTennisPlayer) => {
    const { points_won, matches_played } = player.stats;
    if (!matches_played) return 0;
    return (points_won / matches_played).toFixed(1);
  };

  const handleDeletePlayer = async (playerId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este jogador?')) {
      return
    }

    try {
      setLoadingAction(playerId.toString())

      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId)

      if (error) throw error

      // Atualizar a lista de jogadores localmente
      setPlayers(players.filter(player => player.id !== playerId))
      toast.success('Jogador excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir jogador:', error)
      toast.error('Erro ao excluir jogador')
    } finally {
      setLoadingAction(null)
    }
  }

  if (!selectedTeam) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            Nenhum time selecionado
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Selecione um time para ver seus detalhes
          </p>
        </div>
      </div>
    );
  }

  return (
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
            <div className="text-gray-500 dark:text-gray-400">Quadra</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {selectedTeam.home_court}
            </div>
          </div>
       </div>

      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-1">
        {players?.map((player) => (
          <div
            key={player.id}
            className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                    {player.number}
                  </span>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {player.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-1">
                  {player.is_captain && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                  {player.is_starter && (
                    <Star className="h-4 w-4 text-blue-500" />
                  )}
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block font-medium">Posição</span>
                    <span>{player.position}</span>
                  </div>
                  <div>
                    <span className="block font-medium">Empunhadura</span>
                    <span>{player.grip_style}</span>
                  </div>
                  <div>
                    <span className="block font-medium">Estilo</span>
                    <span>{player.play_style}</span>
                  </div>
                  <div>
                    <span className="block font-medium">Win Rate</span>
                    <span>{getWinRate(player)}%</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xs text-gray-400">Vitórias</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {player.stats.matches_won}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Pts/Partida</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {getPointsAverage(player)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Aces</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {player.stats.aces}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-5">
                <button
                  onClick={() => {
                    setSelectedPlayer(player);
                    setShowStatsModal(true);
                  }}
                  className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <Table2 className="mr-1 h-4 w-4" />
                  Stats
                </button>
                <button
                  onClick={() => onToggleStarter(player)}
                  className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <Star className="mr-1 h-4 w-4" />
                  {player.is_starter ? 'Reserva' : 'Titular'}
                </button>
                <button
                  onClick={() => onToggleCaptain(player)}
                  className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <Crown className="mr-1 h-4 w-4" />
                  {player.is_captain ? 'Remover' : 'Capitão'}
                </button>
                <button
                  onClick={() => onEditPlayer(player)}
                  className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeletePlayer(player.id)}
                  disabled={loadingAction === player.id.toString()}
                  className={`
                    p-1 rounded-full text-red-600 
                    hover:bg-red-100 dark:hover:bg-red-900
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                  title="Excluir jogador"
                >
                  {loadingAction === player.id.toString() ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showStatsModal && selectedPlayer && (
        <PlayerStatsModal
          player={selectedPlayer}
          onClose={() => {
            setShowStatsModal(false);
            setSelectedPlayer(null);
          }}
        />
      )}
    </div>
  );
};

export default TableTennisTeamDetails;
