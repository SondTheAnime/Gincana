import { TeamLineup as TeamLineupType, GameStats } from '../types'
import { PlayerStats } from './PlayerStats'

interface TeamLineupProps {
  lineup: TeamLineupType
  gameStats?: Record<number, GameStats>
}

export const TeamLineup = ({ lineup, gameStats }: TeamLineupProps) => {
  const starters = lineup.players.filter(player => player.is_starter)
  const substitutes = lineup.players.filter(player => !player.is_starter)
  const captain = lineup.players.find(player => player.is_captain)

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 dark:text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>{lineup.team_name}</span>
          {captain && (
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-normal">
              Capitão: {captain.name} #{captain.number}
            </span>
          )}
        </h2>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 dark:text-white">Titulares</h3>
        <div className="space-y-3 sm:space-y-4">
          {starters.length > 0 ? (
            starters.map(player => (
              <PlayerStats
                key={player.id}
                player={player}
                gameStats={gameStats?.[player.id]}
              />
            ))
          ) : (
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Nenhum titular definido
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 dark:text-white">Reservas</h3>
        <div className="space-y-3 sm:space-y-4">
          {substitutes.length > 0 ? (
            substitutes.map(player => (
              <PlayerStats
                key={player.id}
                player={player}
                gameStats={gameStats?.[player.id]}
              />
            ))
          ) : (
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Nenhum reserva definido
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 