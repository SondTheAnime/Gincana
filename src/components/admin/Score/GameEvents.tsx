import { useState } from 'react'
import { Game, GameEvent, Player, EventType } from './types'
import { Plus } from 'lucide-react'

interface GameEventsProps {
  game: Game
  players: Player[]
  onAddEvent: (event: Omit<GameEvent, 'id' | 'created_at' | 'updated_at'>) => void
}

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'goal', label: 'Gol' },
  { value: 'assist', label: 'Assistência' },
  { value: 'yellowCard', label: 'Cartão Amarelo' },
  { value: 'redCard', label: 'Cartão Vermelho' }
]

const GameEvents = ({ game, players, onAddEvent }: GameEventsProps) => {
  const [selectedTeam, setSelectedTeam] = useState<'A' | 'B'>('A')
  const [selectedType, setSelectedType] = useState<EventType>('goal')
  const [selectedPlayer, setSelectedPlayer] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPlayer) return

    onAddEvent({
      game_id: game.id,
      player_id: parseInt(selectedPlayer),
      team: selectedTeam,
      type: selectedType
    })

    // Resetar seleções
    setSelectedPlayer('')
  }

  const teamPlayers = players.filter(player => 
    selectedTeam === 'A' ? player.team_id === game.team_a : player.team_id === game.team_b
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Eventos do Jogo</h3>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value as 'A' | 'B')}
            className="rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 px-2 text-sm"
          >
            <option value="A">{game.team_a_name}</option>
            <option value="B">{game.team_b_name}</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as EventType)}
            className="rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 px-2 text-sm"
          >
            {EVENT_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 px-2 text-sm"
          >
            <option value="">Selecione um jogador</option>
            {teamPlayers.map(player => (
              <option key={player.id} value={player.id}>
                {player.number} - {player.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={!selectedPlayer}
            className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </button>
        </form>
      </div>

      <div className="space-y-2">
        {game.highlights?.map((event, index) => {
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