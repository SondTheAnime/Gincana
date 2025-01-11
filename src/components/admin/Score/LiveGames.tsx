import { MapPin, Clock } from 'lucide-react'
import { Game } from './types'
import { motion } from 'framer-motion'

interface LiveGamesProps {
  games: Game[]
  onSelectGame: (game: Game) => void
}

const LiveGames = ({ games, onSelectGame }: LiveGamesProps) => {
  const handleGameClick = (game: Game) => {
    onSelectGame(game)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white px-2 sm:px-0">Jogos em Andamento</h2>
      
      <div className="grid gap-3 sm:gap-4 px-2 sm:px-0">
        {games.filter(game => game.isLive).map(game => (
          <motion.div
            key={game.id}
            layoutId={`game-${game.id}`}
            onClick={() => handleGameClick(game)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0 mb-3 sm:mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{game.sport}</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{game.category}</p>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {game.location}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 items-center">
              <div className="text-center">
                <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">{game.teamA}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{game.scoreA}</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-1">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-xs sm:text-sm font-medium">{game.time}</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{game.period}</span>
              </div>

              <div className="text-center">
                <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">{game.teamB}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{game.scoreB}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {games.filter(game => game.isLive).length === 0 && (
        <div className="text-center py-8 sm:py-12 bg-white dark:bg-gray-800 rounded-lg mx-2 sm:mx-0">
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Nenhum jogo ao vivo no momento</p>
        </div>
      )}
    </div>
  )
}

export default LiveGames 