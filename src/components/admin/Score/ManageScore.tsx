import { useState } from 'react'
import { Game } from './types'
import LiveGames from './LiveGames'
import GameDetails from './GameDetails'
import { AnimatePresence } from 'framer-motion'

const ManageScore = () => {
  const [games, setGames] = useState<Game[]>([
    {
      id: 1,
      sport: 'Futsal',
      teamA: 'Informática',
      teamB: 'Automação',
      scoreA: 2,
      scoreB: 1,
      time: '25:13',
      period: '2º Tempo',
      location: 'Quadra Principal',
      category: 'Masculino',
      isLive: true
    },
    {
      id: 2,
      sport: 'Vôlei',
      teamA: 'Edificações',
      teamB: 'Mecânica',
      scoreA: 1,
      scoreB: 2,
      time: '15:00',
      period: '3º Set',
      location: 'Ginásio',
      category: 'Feminino',
      isLive: true
    }
  ])

  const [selectedGame, setSelectedGame] = useState<Game | null>(null)

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game)
  }

  const handleGameUpdate = (updatedGame: Game) => {
    setGames(games.map(game => 
      game.id === updatedGame.id ? updatedGame : game
    ))
    setSelectedGame(updatedGame)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white px-2 sm:px-0">Gerenciar Placares</h2>
      
      <LiveGames
        games={games}
        onSelectGame={handleGameSelect}
      />

      <AnimatePresence>
        {selectedGame && (
          <GameDetails
            game={selectedGame}
            onClose={() => setSelectedGame(null)}
            onUpdateGame={handleGameUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageScore 