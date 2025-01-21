import { Game } from '../../types'

interface TableTennisScoreboardProps {
  game: Game
}

export const TableTennisScoreboard = ({ game }: TableTennisScoreboardProps) => {
  const tableTennisData = game.table_tennis_data
  const config = game.config

  if (!tableTennisData) return null

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Placar Geral */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="text-center">
          <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2 truncate">
            {game.team_a_name}
          </h3>
          <div className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            {game.score_a}
          </div>
          {tableTennisData.server === 'A' && (
            <div className="mt-1 sm:mt-2">
              <span className="text-xs sm:text-sm text-yellow-500 dark:text-yellow-400">
                Saque
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center">
          <span className="text-xl sm:text-2xl font-medium text-gray-400 dark:text-gray-500">
            vs
          </span>
        </div>
        <div className="text-center">
          <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2 truncate">
            {game.team_b_name}
          </h3>
          <div className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            {game.score_b}
          </div>
          {tableTennisData.server === 'B' && (
            <div className="mt-1 sm:mt-2">
              <span className="text-xs sm:text-sm text-yellow-500 dark:text-yellow-400">
                Serviço
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Histórico de Sets */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
          Histórico de Sets
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:gap-4">
          {tableTennisData.sets.map((set, index) => (
            <div
              key={index}
              className={`p-3 sm:p-4 rounded-lg ${
                set.status === 'in_progress'
                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
                  {set.number}º Set
                </span>
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    set.status === 'in_progress'
                      ? 'text-blue-600 dark:text-blue-400'
                      : set.status === 'finished'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {set.status === 'in_progress'
                    ? 'Em andamento'
                    : set.status === 'finished'
                    ? 'Finalizado'
                    : 'Não iniciado'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {set.score_a}
                  </div>
                  {set.winner === 'A' && (
                    <div className="mt-1">
                      <span className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">
                        Vencedor
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-gray-400 dark:text-gray-500">-</span>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {set.score_b}
                  </div>
                  {set.winner === 'B' && (
                    <div className="mt-1">
                      <span className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">
                        Vencedor
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {set.status === 'in_progress' && (
                <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center mb-2">
                    Pontos para vencer: {config.points_per_set}
                  </div>
                  <div className="text-center">
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Serviços restantes: {tableTennisData.serves_left}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 