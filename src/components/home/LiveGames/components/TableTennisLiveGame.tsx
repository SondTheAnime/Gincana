import type { TableTennisGame } from '../../../admin/Score/modalities/table-tennis/types'
import { formatTime } from '../../../../utils/date'

interface TableTennisLiveGameProps {
  game: TableTennisGame
}

export const TableTennisLiveGame = ({ game }: TableTennisLiveGameProps) => {
  const currentSet = game.sets?.find(s => s.set_number === game.details?.current_set)
  const setsNecessariosParaVencer = Math.ceil((game.config?.total_sets || 0) / 2)
  const setsRestantes = (game.config?.total_sets || 0) - (game.sets?.filter(s => s.status === 'finished').length || 0)

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            {formatTime(game.game_time)} - {game.period}
          </span>
          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
            {game.sport}
          </span>
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">
            {game.category}
          </span>
        </div>
      </div>

      {/* Placar Principal */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-2">{game.team_a_name}</h3>
          <div className="text-4xl font-bold text-white">{game.score_a}</div>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-2xl text-gray-400">vs</span>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-2">{game.team_b_name}</h3>
          <div className="text-4xl font-bold text-white">{game.score_b}</div>
        </div>
      </div>

      {/* Sets */}
      {game.sets && (
        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-5 gap-2">
            {game.sets.map((set) => (
              <div 
                key={set.set_number}
                className={`text-center p-2 rounded ${
                  set.status === 'in_progress' 
                    ? 'bg-blue-500/20 border border-blue-500'
                    : set.status === 'finished'
                    ? 'bg-gray-600'
                    : 'bg-gray-800'
                }`}
              >
                <div className="text-xs text-gray-400 mb-1">
                  {set.set_number}º
                </div>
                <div className="text-sm font-bold text-white">
                  {set.score_a}-{set.score_b}
                </div>
                {set.status === 'in_progress' && (
                  <div className="text-xs text-blue-400 mt-1">
                    Em jogo
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Informações do Set Atual */}
      {currentSet && currentSet.status === 'in_progress' && (
        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">
            Set {currentSet.set_number} - Pontos para vencer: {game.config?.points_per_set}
          </h4>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <span className="text-2xl font-bold text-white">
                {currentSet.score_a}
              </span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">
                {currentSet.score_b}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Informações Adicionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-gray-400">Sets para Vencer</div>
          <div className="text-white font-bold">{setsNecessariosParaVencer}</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-gray-400">Sets Restantes</div>
          <div className="text-white font-bold">{setsRestantes}</div>
        </div>
      </div>

      {/* Local */}
      <div className="mt-4 text-sm text-gray-400">
        {game.location}
      </div>
    </div>
  )
}

export default TableTennisLiveGame 