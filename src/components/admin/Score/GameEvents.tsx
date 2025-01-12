import { useState } from 'react'
import { Game, GameEvent, Player, EventType } from './types'

interface GameEventsProps {
  game: Game
  players: Player[]
  onAddEvent: (event: Omit<GameEvent, 'created_at'>) => void
}

const EVENT_TYPES = [
  { value: 'goal', label: 'Gol' },
  { value: 'yellow_card', label: 'Cartão Amarelo' },
  { value: 'red_card', label: 'Cartão Vermelho' },
  { value: 'substitution', label: 'Substituição' }
]

const GameEvents = ({ game, players, onAddEvent }: GameEventsProps) => {
  const [newEvent, setNewEvent] = useState({
    type: 'goal' as EventType,
    team: 'A' as 'A' | 'B',
    player_id: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEvent.player_id) return

    onAddEvent({
      type: newEvent.type,
      team: newEvent.team,
      player_id: parseInt(newEvent.player_id)
    })

    setNewEvent({
      ...newEvent,
      player_id: ''
    })
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <select
            value={newEvent.type}
            onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as EventType })}
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3 text-sm"
          >
            {EVENT_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <select
            value={newEvent.team}
            onChange={(e) => setNewEvent({ ...newEvent, team: e.target.value as 'A' | 'B' })}
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3 text-sm"
          >
            <option value="A">{game.team_a_name}</option>
            <option value="B">{game.team_b_name}</option>
          </select>

          <select
            value={newEvent.player_id}
            onChange={(e) => setNewEvent({ ...newEvent, player_id: e.target.value })}
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3 text-sm"
            required
          >
            <option value="">Selecione o jogador</option>
            {players
              .filter(player => 
                (newEvent.team === 'A' && player.team_id === game.team_a) ||
                (newEvent.team === 'B' && player.team_id === game.team_b)
              )
              .map(player => (
                <option key={player.id} value={player.id}>
                  {player.name} ({player.number})
                </option>
              ))
            }
          </select>

          <button
            type="submit"
            disabled={!newEvent.player_id}
            className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Adicionar
          </button>
        </form>
      </div>

      <div className="space-y-2">
        {(game.highlights || []).map((event, index) => {
          const player = players.find(p => p.id === event.player_id)
          const eventType = EVENT_TYPES.find(t => t.value === event.type)
          
          if (!player || !eventType) return null

          return (
            <div
              key={index}
              className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {event.team === 'A' ? game.team_a_name : game.team_b_name}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {eventType.label} - {player.name}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(event.created_at).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GameEvents 