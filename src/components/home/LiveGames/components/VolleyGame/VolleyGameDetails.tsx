import { X, Clock, Trophy, Users2, Timer, Award, CircleDot } from 'lucide-react'
import { Game } from '../../types'
import { VolleyTeamLineup } from './VolleyTeamLineup'
import { useEffect, useState } from 'react'
import { GameEvent, getGameEvents, getPointTypeLabel } from './utils/gameEvents'
import { cn } from '../../../../../lib/cn'
// import { VolleyPlayerStats } from './VolleyPlayerStats'

interface VolleyGameDetailsProps {
  game: Game
  onClose: () => void
}

export const VolleyGameDetails = ({ game, onClose }: VolleyGameDetailsProps) => {
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([])
  const [loading, setLoading] = useState(true)
  const volleyballData = game.volleyball_data

  useEffect(() => {
    async function loadGameEvents() {
      try {
        const events = await getGameEvents(game.id)
        setGameEvents(events)
        console.log('Eventos do jogo:', events)
      } catch (error) {
        console.error('Erro ao carregar eventos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGameEvents()
  }, [game.id])

  if (!volleyballData?.sets) {
    return null
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center overflow-y-auto p-4 sm:p-6 z-50 backdrop-blur-sm" onClick={handleBackdropClick}>
      <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 lg:p-8 rounded-lg w-full max-w-6xl my-8 relative shadow-xl border border-gray-200 dark:border-gray-800">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <h2 className="text-xl sm:text-2xl font-bold dark:text-white">
                  {game.team_a_name} vs {game.team_b_name}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
                <CircleDot className="h-4 w-4" />
                <span>{game.sport}</span>
                <span>•</span>
                <Users2 className="h-4 w-4" />
                <span>{game.category}</span>
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-3xl sm:text-4xl font-bold dark:text-white mb-1">
                {game.score_a} - {game.score_b}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Timer className="h-4 w-4" />
                <span>{game.game_time}</span>
                <span>•</span>
                <span>{game.period}</span>
              </div>
            </div>
          </div>

          {/* Informações do Jogo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div className="space-y-2 sm:space-y-4">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                <span className="font-medium">Data:</span> {new Date(game.date).toLocaleDateString('pt-BR')}
              </p>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                <span className="font-medium">Horário:</span> {game.time}
              </p>
            </div>
            <div className="space-y-2 sm:space-y-4">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                <span className="font-medium">Local:</span> {game.location}
              </p>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                <span className="font-medium">Status:</span>{' '}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                  {game.status === 'live' ? 'AO VIVO' : game.status}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Sets */}
        {volleyballData && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Sets</h3>
            <div className="grid grid-cols-5 gap-4">
              {volleyballData.sets.map((set, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Set {set.number}</div>
                  <div className="text-center">
                    <div className="text-xl font-bold dark:text-white">
                      {set.status !== 'not_started' ? `${set.score_a}-${set.score_b}` : '-'}
                    </div>
                    {set.winner && (
                      <div className="mt-2">
                        <span className="text-sm font-medium text-green-500">
                          Vencedor: {set.winner === 'A' ? game.team_a_name : game.team_b_name}
                        </span>
                      </div>
                    )}
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {set.status === 'in_progress' ? 'Em andamento' : 
                       set.status === 'finished' ? 'Finalizado' : 'Não iniciado'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estatísticas e Escalações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Time A - {game.team_a_name}</h3>
            <VolleyTeamLineup teamId={game.team_a} />
            {/* <VolleyPlayerStats teamId={game.team_a} /> */}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Time B - {game.team_b_name}</h3>
            <VolleyTeamLineup teamId={game.team_b} />
            {/* <VolleyPlayerStats teamId={game.team_b} /> */}
          </div>
        </div>

        {/* Minuto a Minuto */}
        <div className="bg-white dark:bg-gray-900 rounded-lg mt-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-bold dark:text-white">Minuto a Minuto</h3>
          </div>
          
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : gameEvents.length > 0 ? (
              gameEvents.map((event, index) => (
                <div 
                  key={index}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg transition-colors",
                    "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800",
                    "border border-gray-200 dark:border-gray-700"
                  )}
                >
                  <div className="flex-shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400 w-12 text-center">
                    {new Date(event.created_at).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <div className="flex-1">
                    {event.type === 'point' ? (
                      <div className="space-y-2">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1",
                            event.point_type === 'attack' && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                            event.point_type === 'block' && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                            event.point_type === 'ace' && "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
                            event.point_type === 'opponent_error' && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          )}>
                            <Award className="h-3 w-3" />
                            {getPointTypeLabel(event.point_type)}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">•</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {event.team === 'A' ? game.team_a_name : game.team_b_name}
                          </span>
                        </div>
                        {event.players?.name && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Users2 className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{event.players.name}</span>
                          </div>
                        )}
                      </div>
                    ) : event.type === 'timeout' ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-medium rounded-full inline-flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            Tempo
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">•</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {event.team === 'A' ? game.team_a_name : game.team_b_name}
                          </span>
                        </div>
                        {event.remaining_timeouts !== undefined && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>Tempos restantes no set: <span className="font-medium">{event.remaining_timeouts}</span></span>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhum acontecimento registrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 