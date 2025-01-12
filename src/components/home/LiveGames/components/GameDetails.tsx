import { useGameDetails } from '../hooks/useGameDetails'
import { TeamLineup } from './TeamLineup'
import { X, Clock } from 'lucide-react'
import { GameEvent } from '../types'
import { useCallback } from 'react'

interface GameDetailsProps {
  gameId: number
  onClose: () => void
}

const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

const formatEventType = (type: string) => {
  switch (type) {
    case 'goal':
      return '⚽ Gol'
    case 'yellow_card':
      return '🟨 Cartão Amarelo'
    case 'red_card':
      return '🟥 Cartão Vermelho'
    case 'substitution':
      return '🔄 Substituição'
    default:
      return type
  }
}

export const GameDetails = ({ gameId, onClose }: GameDetailsProps) => {
  const { game, teamALineup, teamBLineup, gameStats, loading, error } = useGameDetails({ gameId })

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  const sortedHighlights = game?.highlights?.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const getPlayerName = (playerId: number, teamId: number) => {
    const player = teamId === game?.team_a
      ? teamALineup?.players.find(p => p.id === playerId)
      : teamBLineup?.players.find(p => p.id === playerId)
    
    return player ? `${player.name} (#${player.number})` : 'Jogador não encontrado'
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-start justify-center overflow-y-auto p-4 sm:p-6 z-50" onClick={handleBackdropClick}>
        <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 lg:p-8 rounded-lg w-full max-w-6xl my-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !game || !teamALineup || !teamBLineup) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-start justify-center overflow-y-auto p-4 sm:p-6 z-50" onClick={handleBackdropClick}>
        <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 lg:p-8 rounded-lg w-full max-w-6xl my-8">
          <div className="text-center">
            <p className="text-red-500">Erro ao carregar detalhes do jogo</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center overflow-y-auto p-4 sm:p-6 z-50" onClick={handleBackdropClick}>
      <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 lg:p-8 rounded-lg w-full max-w-6xl my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" />
        </button>

        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold dark:text-white">
                {game.team_a_name} vs {game.team_b_name}
              </h2>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                {game.sport} - {game.category}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold dark:text-white">
                {game.score_a} - {game.score_b}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {game.game_time} - {game.period}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div className="space-y-2 sm:space-y-4">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                <span className="font-medium">Data:</span> {formatDate(game.date)}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <TeamLineup lineup={teamALineup} gameStats={gameStats} />
          <TeamLineup lineup={teamBLineup} gameStats={gameStats} />
        </div>

        {/* Minuto a Minuto */}
        <div className="mt-6 sm:mt-8">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
            <h3 className="text-base sm:text-lg font-bold dark:text-white">Minuto a Minuto</h3>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {sortedHighlights?.length ? (
              sortedHighlights.map((event: GameEvent, index) => {
                const teamName = event.team === 'A' ? game.team_a_name : game.team_b_name
                const teamId = event.team === 'A' ? game.team_a : game.team_b
                const playerName = getPlayerName(event.player_id, teamId)
                const eventTime = new Date(event.created_at).toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })

                return (
                  <div 
                    key={index}
                    className="flex items-start space-x-3 p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex-shrink-0 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 w-10 sm:w-12">
                      {eventTime}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                          {formatEventType(event.type)}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                          {teamName}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {playerName}
                      </p>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-center text-sm sm:text-base text-gray-500 dark:text-gray-400 py-4">
                Nenhum acontecimento registrado
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 