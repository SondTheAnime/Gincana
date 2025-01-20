import { TableTennisGame } from '../types'

interface TableTennisHighlightsProps {
  game: TableTennisGame
  onUpdateGame: (game: TableTennisGame) => void
}

export const TableTennisHighlights = ({ game, onUpdateGame }: TableTennisHighlightsProps) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Eventos do Jogo
      </h3>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {game.highlights.map((event, index) => (
          <div
            key={event.id || index}
            className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {event.type === 'point' ? '🏓 Ponto' : '⏱️ Timeout'}
              </span>
              <span className="text-sm text-gray-500">
                {event.team === 'A' ? game.team_a_name : game.team_b_name}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(event.created_at || '').toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
} 