import { Game } from '../../types'

interface TableTennisPlayerStatsProps {
  game: Game
}

export const TableTennisPlayerStats = ({ game }: TableTennisPlayerStatsProps) => {
  const tableTennisData = game.table_tennis_data

  if (!tableTennisData) return null

  const stats = {
    team_a: {
      name: game.team_a_name,
      points_won: tableTennisData.sets.reduce((acc, set) => acc + set.score_a, 0),
      sets_won: tableTennisData.sets.filter((set) => set.winner === 'A').length,
      service_points: tableTennisData.service_points_a || 0,
      return_points: tableTennisData.return_points_a || 0,
      errors: tableTennisData.errors_a || 0,
    },
    team_b: {
      name: game.team_b_name,
      points_won: tableTennisData.sets.reduce((acc, set) => acc + set.score_b, 0),
      sets_won: tableTennisData.sets.filter((set) => set.winner === 'B').length,
      service_points: tableTennisData.service_points_b || 0,
      return_points: tableTennisData.return_points_b || 0,
      errors: tableTennisData.errors_b || 0,
    },
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Time A */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 text-center truncate">
            {stats.team_a.name}
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total de Pontos</div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                {stats.team_a.points_won}
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Sets Vencidos</div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                {stats.team_a.sets_won}
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Pontos de Saque</div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                {stats.team_a.service_points}
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Pontos de Recepção</div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                {stats.team_a.return_points}
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Erros</div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                {stats.team_a.errors}
              </div>
            </div>
          </div>
        </div>

        {/* Comparação */}
        <div className="hidden sm:flex flex-col justify-center">
          <div className="space-y-2 sm:space-y-3">
            <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Total de Pontos
              <div className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                {stats.team_a.points_won} - {stats.team_b.points_won}
              </div>
            </div>
            <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Sets Vencidos
              <div className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                {stats.team_a.sets_won} - {stats.team_b.sets_won}
              </div>
            </div>
            <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Pontos de Saque
              <div className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                {stats.team_a.service_points} - {stats.team_b.service_points}
              </div>
            </div>
            <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Pontos de Recepção
              <div className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                {stats.team_a.return_points} - {stats.team_b.return_points}
              </div>
            </div>
            <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Erros
              <div className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                {stats.team_a.errors} - {stats.team_b.errors}
              </div>
            </div>
          </div>
        </div>

        {/* Time B */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 text-center truncate">
            {stats.team_b.name}
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total de Pontos</div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                {stats.team_b.points_won}
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Sets Vencidos</div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                {stats.team_b.sets_won}
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Pontos de Saque</div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                {stats.team_b.service_points}
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Pontos de Recepção</div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                {stats.team_b.return_points}
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Erros</div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                {stats.team_b.errors}
              </div>
            </div>
          </div>
        </div>

        {/* Comparação Mobile */}
        <div className="sm:hidden">
          <div className="space-y-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              Total de Pontos
              <div className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                {stats.team_a.points_won} - {stats.team_b.points_won}
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              Sets Vencidos
              <div className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                {stats.team_a.sets_won} - {stats.team_b.sets_won}
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              Pontos de Saque
              <div className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                {stats.team_a.service_points} - {stats.team_b.service_points}
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              Pontos de Recepção
              <div className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                {stats.team_a.return_points} - {stats.team_b.return_points}
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              Erros
              <div className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                {stats.team_a.errors} - {stats.team_b.errors}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 