import { Player, GameStats } from '../types'
import { Star } from 'lucide-react'

interface PlayerStatsProps {
  player: Player
  gameStats?: GameStats
}

export const PlayerStats = ({ player, gameStats }: PlayerStatsProps) => {
  const hasStats = gameStats && (
    gameStats.goals > 0 ||
    gameStats.assists > 0 ||
    gameStats.yellow_cards > 0 ||
    gameStats.red_cards > 0
  )

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-sm ${hasStats ? 'ring-2 ring-red-500/20' : ''}`}>
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="relative">
          {player.photo ? (
            <img
              src={player.photo}
              alt={player.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl">
                {player.name.charAt(0)}
              </span>
            </div>
          )}
          {player.is_captain && (
            <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5 sm:p-1">
              <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-medium dark:text-white flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{player.name}</span>
            <span className="text-sm sm:text-base text-gray-500">#{player.number}</span>
            {player.is_captain && (
              <span className="text-xs text-yellow-600 dark:text-yellow-400">(C)</span>
            )}
            {gameStats?.red_cards ? (
              <span className="text-red-500 text-sm">🟥</span>
            ) : gameStats?.yellow_cards ? (
              <span className="text-yellow-500 text-sm">🟨</span>
            ) : null}
          </h3>
          {player.position && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {player.position}
            </p>
          )}
        </div>
      </div>

      {hasStats && (
        <div className="mt-3 sm:mt-4 space-y-2">
          {gameStats.goals > 0 && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-500 dark:text-gray-400 flex items-center">
                <span className="mr-1">⚽</span> Gols
              </span>
              <span className="font-medium dark:text-white">
                {gameStats.goals}
              </span>
            </div>
          )}

          {gameStats.assists > 0 && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-500 dark:text-gray-400 flex items-center">
                <span className="mr-1">👟</span> Assistências
              </span>
              <span className="font-medium dark:text-white">
                {gameStats.assists}
              </span>
            </div>
          )}

          {gameStats.yellow_cards > 0 && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-500 dark:text-gray-400 flex items-center">
                <span className="mr-1">🟨</span> Cartões Amarelos
              </span>
              <span className="font-medium dark:text-white">
                {gameStats.yellow_cards}
              </span>
            </div>
          )}

          {gameStats.red_cards > 0 && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-500 dark:text-gray-400 flex items-center">
                <span className="mr-1">🟥</span> Cartões Vermelhos
              </span>
              <span className="font-medium dark:text-white">
                {gameStats.red_cards}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 sm:mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Minutos Jogados
          </span>
          <span className="font-medium dark:text-white">
            {gameStats?.minutes_played || 0}'
          </span>
        </div>
      </div>
    </div>
  )
} 