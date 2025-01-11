import { useState } from 'react'
import { motion } from 'framer-motion'
import { Game, GameEvent, Player } from './types'
import GameTimer from './GameTimer'
import GameEvents from './GameEvents'
import { X } from 'lucide-react'

interface GameDetailsProps {
  game: Game
  onClose: () => void
  onUpdateGame: (game: Game) => void
}

const GameDetails = ({ game, onClose, onUpdateGame }: GameDetailsProps) => {
  const [events, setEvents] = useState<GameEvent[]>([])

  // Mock players - Em produção, isso viria do backend
  const mockPlayers: Player[] = [
    { id: 1, name: 'João Silva', number: 10, team: game.teamA },
    { id: 2, name: 'Pedro Santos', number: 7, team: game.teamA },
    { id: 3, name: 'Carlos Oliveira', number: 9, team: game.teamB },
    { id: 4, name: 'Lucas Souza', number: 11, team: game.teamB },
  ]

  const handleScoreChange = (team: 'A' | 'B', value: number) => {
    const updatedGame = {
      ...game,
      [`score${team}`]: Math.max(0, value)
    }
    onUpdateGame(updatedGame)
  }

  const handleTimeUpdate = (time: string) => {
    onUpdateGame({ ...game, time })
  }

  const handlePeriodChange = (period: string) => {
    onUpdateGame({ ...game, period })
  }

  const handleAddEvent = (newEvent: Omit<GameEvent, 'id'>) => {
    const event = { ...newEvent, id: events.length + 1 }
    setEvents([...events, event])

    // Atualizar placar se for gol
    if (newEvent.type === 'goal') {
      handleScoreChange(
        newEvent.team,
        newEvent.team === 'A' ? game.scoreA + 1 : game.scoreB + 1
      )
    }
  }

  return (
    <motion.div
      layoutId={`game-${game.id}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl p-3 sm:p-6">
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{game.sport}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{game.category}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-6 sm:mb-8">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">{game.teamA}</h3>
            <input
              type="number"
              value={game.scoreA}
              onChange={(e) => handleScoreChange('A', parseInt(e.target.value))}
              min="0"
              className="w-20 sm:w-24 text-center text-3xl sm:text-4xl font-bold bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg py-1.5 sm:py-2"
            />
          </div>

          <div className="text-center space-y-3 sm:space-y-4">
            <GameTimer initialTime={game.time} onTimeUpdate={handleTimeUpdate} />
            
            <select
              value={game.period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="w-full text-sm sm:text-base rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3"
            >
              <option>1º Tempo</option>
              <option>2º Tempo</option>
              <option>Intervalo</option>
              <option>Prorrogação</option>
              <option>Finalizado</option>
            </select>
          </div>

          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">{game.teamB}</h3>
            <input
              type="number"
              value={game.scoreB}
              onChange={(e) => handleScoreChange('B', parseInt(e.target.value))}
              min="0"
              className="w-20 sm:w-24 text-center text-3xl sm:text-4xl font-bold bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg py-1.5 sm:py-2"
            />
          </div>
        </div>

        <GameEvents
          game={game}
          players={mockPlayers}
          onAddEvent={handleAddEvent}
        />
      </div>
    </motion.div>
  )
}

export default GameDetails 