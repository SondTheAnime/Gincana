import { useState } from 'react'
import { GameEvent, Game, Player } from './types'
import { Plus, Goal, Award, Square } from 'lucide-react'

interface GameEventsProps {
  game: Game
  players: Player[]
  onAddEvent: (event: Omit<GameEvent, 'id'>) => void
}

const GameEvents = ({ game, players, onAddEvent }: GameEventsProps) => {
  const [showForm, setShowForm] = useState(false)
  const [selectedType, setSelectedType] = useState<GameEvent['type']>('goal')
  const [selectedTeam, setSelectedTeam] = useState<'A' | 'B'>('A')
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [minute, setMinute] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const player = players.find(p => p.id.toString() === selectedPlayer)
    if (!player) return

    const newEvent: Omit<GameEvent, 'id'> = {
      gameId: game.id,
      type: selectedType,
      playerId: player.id,
      playerName: player.name,
      team: selectedTeam,
      timestamp: new Date().toISOString(),
      minute: parseInt(minute)
    }

    onAddEvent(newEvent)
    setShowForm(false)
    resetForm()
  }

  const resetForm = () => {
    setSelectedType('goal')
    setSelectedTeam('A')
    setSelectedPlayer('')
    setMinute('')
  }

  const eventIcons = {
    goal: <Goal className="h-5 w-5" />,
    assist: <Award className="h-5 w-5" />,
    yellowCard: <Square className="h-5 w-5 text-yellow-400" />,
    redCard: <Square className="h-5 w-5 text-red-500" />
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Eventos da Partida</h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 px-3 py-1.5 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>Adicionar Evento</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Evento
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as GameEvent['type'])}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3 text-sm"
              >
                <option value="goal" className="flex items-center">
                  <div className="flex items-center">
                    {eventIcons.goal} Gol
                  </div>
                </option>
                <option value="assist">
                  <div className="flex items-center">
                    {eventIcons.assist} Assistência
                  </div>
                </option>
                <option value="yellowCard">
                  <div className="flex items-center">
                    {eventIcons.yellowCard} Cartão Amarelo
                  </div>
                </option>
                <option value="redCard">
                  <div className="flex items-center">
                    {eventIcons.redCard} Cartão Vermelho
                  </div>
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time
              </label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value as 'A' | 'B')}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3 text-sm"
              >
                <option value="A">{game.teamA}</option>
                <option value="B">{game.teamB}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Jogador
              </label>
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3 text-sm"
              >
                <option value="">Selecione um jogador</option>
                {players
                  .filter(p => p.team === (selectedTeam === 'A' ? game.teamA : game.teamB))
                  .map(player => (
                    <option key={player.id} value={player.id}>
                      {player.number} - {player.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Minuto
              </label>
              <input
                type="number"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                min="0"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3 text-sm"
                placeholder="Minuto do evento"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 sm:space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default GameEvents 