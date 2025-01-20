import { X, Clock } from 'lucide-react'
import { Game } from '../../types'
import { VolleyTeamLineup } from './VolleyTeamLineup'
// import { VolleyPlayerStats } from './VolleyPlayerStats'

interface VolleyGameDetailsProps {
  game: Game
  onClose: () => void
}

export const VolleyGameDetails = ({ game, onClose }: VolleyGameDetailsProps) => {
  const volleyballData = game.volleyball_data

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
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

        {/* Cabeçalho */}
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
        <div className="mt-6 sm:mt-8">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
            <h3 className="text-base sm:text-lg font-bold dark:text-white">Minuto a Minuto</h3>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {game.highlights?.length ? (
              game.highlights.map((event, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-3 p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex-shrink-0 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 w-10 sm:w-12">
                    {new Date(event.created_at).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                        {event.type}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">•</span>
                      <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                        {event.team === 'A' ? game.team_a_name : game.team_b_name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))
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