import { useState } from 'react'
import { Game } from '../../types'
import { VolleyGameDetails } from './VolleyGameDetails'
import { cn } from '../../../../../lib/cn'

interface VolleyGameProps {
  game: Game
  onClick: () => void
}

export const VolleyGame = ({ game, onClick }: VolleyGameProps) => {
  const [showDetails, setShowDetails] = useState(false)
  const volleyballData = game.volleyball_data
  const config = game.config

  const handleClick = () => {
    setShowDetails(true)
    onClick()
  }

  return (
    <>
      <div
        onClick={handleClick}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      >
        <div className="p-4">
          {/* Cabeçalho do Jogo */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {game.game_time || '00:00'} - {game.period === 'in_progress' ? 'Em andamento' : game.period}
              </span>
              {game.status === 'live' && (
                <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </div>
            <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
              {game.category === 'masculino' ? 'Masculino' : game.category === 'feminino' ? 'Feminino' : 'Misto'}
            </span>
          </div>

          {/* Placar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 text-center">
              <p className="font-medium dark:text-white mb-2">{game.team_a_name}</p>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{game.score_a || 0}</div>
              {volleyballData?.details && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Timeouts: {volleyballData.details.timeouts_a}/{config.max_timeouts}
                </div>
              )}
            </div>
            <div className="px-4">
              <span className="text-lg font-medium text-gray-400 dark:text-gray-500">vs</span>
            </div>
            <div className="flex-1 text-center">
              <p className="font-medium dark:text-white mb-2">{game.team_b_name}</p>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{game.score_b || 0}</div>
              {volleyballData?.details && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Timeouts: {volleyballData.details.timeouts_b}/{config.max_timeouts}
                </div>
              )}
            </div>
          </div>

          {/* Sets */}
          {volleyballData && (
            <div className="grid grid-cols-5 gap-2 mb-4">
              {volleyballData.sets.map((set, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Set {set.number}</div>
                  <div className={cn(
                    "rounded p-2",
                    set.status === 'in_progress' 
                      ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  )}>
                    <span className="text-sm font-medium dark:text-white">
                      {set.status !== 'not_started' ? `${set.score_a || 0}-${set.score_b || 0}` : '-'}
                    </span>
                  </div>
                  {set.winner && (
                    <div className="mt-1">
                      <span className={cn(
                        "text-xs font-medium",
                        set.winner === 'A' ? 'text-green-500' : 'text-blue-500'
                      )}>
                        {set.winner === 'A' ? '●' : '○'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pontuação Atual */}
          {volleyballData?.details && typeof volleyballData.details.current_set === 'number' && volleyballData.details.current_set > 0 && (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-4">
              <div className="text-sm text-gray-600 dark:text-gray-300 text-center mb-2">
                Set {volleyballData.details.current_set} - Pontos para vencer: {
                  volleyballData.details.current_set === config.total_sets 
                    ? config.points_last_set || config.points_per_set
                    : config.points_per_set
                }
              </div>
              <div className="flex justify-center items-center space-x-4">
                <div className="text-center">
                  <span className="text-xl font-bold dark:text-white">{volleyballData.details.points_a || 0}</span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{game.team_a_name}</div>
                </div>
                <span className="text-gray-400">-</span>
                <div className="text-center">
                  <span className="text-xl font-bold dark:text-white">{volleyballData.details.points_b || 0}</span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{game.team_b_name}</div>
                </div>
              </div>
            </div>
          )}

          {/* Informações Adicionais */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{game.location}</span>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span>Ao Vivo</span>
            </div>
          </div>

          {/* Highlights */}
          {(game.highlights?.length ?? 0) > 0 && (
            <div className="mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
              {game.highlights?.slice(0, 3).map((event, index) => (
                <div key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                  <span>{new Date(event.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>-</span>
                  <span>{event.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {showDetails && (
        <VolleyGameDetails
          game={game}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  )
} 