import { TableTennisTeam, TableTennisPlayer } from './types';
import { Crown, Star, UserPlus, Table2, Shield } from 'lucide-react';
import PlayerStatsModal from './PlayerStatsModal';
import { useState } from 'react';

interface TableTennisTeamDetailsProps {
  selectedTeam: TableTennisTeam | null;
  onAddPlayer: () => void;
  onEditPlayer: (player: TableTennisPlayer) => void;
  onToggleStarter: (player: TableTennisPlayer) => void;
  onToggleCaptain: (player: TableTennisPlayer) => void;
}

const TableTennisTeamDetails = ({
  selectedTeam,
  onAddPlayer,
  onEditPlayer,
  onToggleStarter,
  onToggleCaptain,
}: TableTennisTeamDetailsProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<TableTennisPlayer | null>(
    null
  );
  const [showStatsModal, setShowStatsModal] = useState(false);

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

  // const renderPlayerCard = (player: TableTennisPlayer) => (
  //   <div
  //     key={player.id}
  //     className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
  //     onClick={() => setSelectedPlayer(player)}
  //   >
  //     <div className="flex items-center justify-between">
  //       <div className="flex items-center space-x-3">
  //         <div className="bg-green-100 dark:bg-green-800 h-12 w-12 rounded-full flex items-center justify-center overflow-hidden relative">
  //           {player.photo ? (
  //             <img 
  //               src={player.photo} 
  //               alt={player.name}
  //               className="h-full w-full object-cover"
  //             />
  //           ) : (
  //             <User className="h-6 w-6 text-green-600 dark:text-green-400" />
  //           )}
  //           {player.is_captain && (
  //             <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
  //               <Star className="h-3 w-3 text-white" />
  //             </div>
  //           )}
  //         </div>
  //         <div>
  //           <p className="font-medium text-gray-900 dark:text-white flex items-center space-x-2">
  //             <span>{player.name}</span>
  //             {player.is_captain && (
  //               <span className="text-xs text-yellow-600 dark:text-yellow-400">(Capitão)</span>
  //             )}
  //           </p>
  //           <div className="text-sm text-gray-500 dark:text-gray-400">
  //             <div className="flex items-center space-x-2">
  //               <span>#{player.number}</span>
  //               <span>•</span>
  //               <span>{player.position}</span>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       <div className="flex items-center space-x-2">
  //         <button 
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             onToggleStarter(player);
  //           }}
  //           className={`px-2 py-1 text-xs rounded-md transition-colors ${
  //             player.is_starter
  //               ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
  //               : 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
  //           }`}
  //         >
  //           {player.is_starter ? 'Titular' : 'Reserva'}
  //         </button>
          
  //         <button 
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             onToggleCaptain(player);
  //           }}
  //           className={`p-1 rounded-md transition-colors ${
  //             player.is_captain
  //               ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400'
  //               : 'text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400'
  //           }`}
  //           aria-label={player.is_captain ? 'Remover Capitão' : 'Definir como Capitão'}
  //         >
  //           <Star className="h-4 w-4" />
  //         </button>
          
  //         <button 
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             onEditPlayer(player);
  //           }}
  //           className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
  //           aria-label="Editar jogador"
  //         >
  //           <Edit className="h-4 w-4" />
  //         </button>
  //       </div>
  //     </div>

  //     <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
  //       <div>
  //         <div className="text-gray-500 dark:text-gray-400">Vitorias</div>
  //         <div className="font-medium text-gray-900 dark:text-white">
  //           {player.stats.matches_won}
  //         </div>
  //       </div>
  //       <div>
  //         <div className="text-gray-500 dark:text-gray-400">Derrotas</div>
  //         <div className="font-medium text-gray-900 dark:text-white">
  //           {player.stats.matches_lost}
  //         </div>
  //       </div>
  //       <div>
  //         <div className="text-gray-500 dark:text-gray-400">Pontos</div>
  //         <div className="font-medium text-gray-900 dark:text-white">
  //           {player.stats.points_won}
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

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

      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-2">
        {selectedTeam.players.map((player) => (
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
