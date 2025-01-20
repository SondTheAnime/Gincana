import { TableTennisGame } from '../types'

interface TableTennisSetsProps {
  game: TableTennisGame
  onUpdateGame: (game: TableTennisGame) => void
}

export const TableTennisSets = ({ game, onUpdateGame }: TableTennisSetsProps) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Sets
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {game.team_a_name}
          </h4>
          <div className="text-4xl font-bold text-gray-900 dark:text-white">
            {game.score_a}
          </div>
        </div>

        <div className="text-center">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {game.team_b_name}
          </h4>
          <div className="text-4xl font-bold text-gray-900 dark:text-white">
            {game.score_b}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {game.sets.map((set) => (
          <div
            key={set.id}
            className={`flex items-center justify-between p-2 rounded-lg ${
              set.status === 'in_progress'
                ? 'bg-blue-50 dark:bg-blue-900/20'
                : 'bg-white dark:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Set {set.set_number}
              </span>
              {set.status === 'in_progress' && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                  Em andamento
                </span>
              )}
              {set.status === 'finished' && (
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                  Finalizado
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {set.score_a}
                </span>
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {set.score_b}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 