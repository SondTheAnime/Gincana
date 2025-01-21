import { useState, useEffect } from 'react'
import { Game } from '../../types'
import { TableTennisGameDetails } from './TableTennisGameDetails'
import { supabase } from '../../../../../lib/supabase'

interface TableTennisGameProps {
  game: Game
  onClick: () => void
}

export const TableTennisGame = ({ game, onClick }: TableTennisGameProps) => {
  const [showDetails, setShowDetails] = useState(false)
  const [tableTennisData, setTableTennisData] = useState(game.table_tennis_data)
  const config = game.config

  // Atualizar tableTennisData quando o game mudar
  useEffect(() => {
    setTableTennisData(game.table_tennis_data)
  }, [game.table_tennis_data])

  useEffect(() => {
    // Função para buscar os detalhes atualizados
    const fetchTableTennisDetails = async () => {
      try {
        const { data: gameDetails, error } = await supabase
          .from('table_tennis_game_details')
          .select('*')
          .eq('game_id', game.id)
          .single()

        if (error) throw error

        if (gameDetails) {
          // Verificar se o set atual está finalizado
          const currentSet = tableTennisData?.sets.find(s => s.number === gameDetails.current_set)
          if (currentSet?.status === 'finished') {
            // Encontrar o próximo set não finalizado
            const nextSet = tableTennisData?.sets.find(s => s.status !== 'finished')
            if (nextSet) {
              // Atualizar para o próximo set
              const { error: updateError } = await supabase
                .from('table_tennis_game_details')
                .update({ current_set: nextSet.number })
                .eq('id', gameDetails.id)

              if (updateError) throw updateError

              // Atualizar o estado local com o novo set atual
              setTableTennisData(prev => prev ? {
                ...prev,
                current_set: nextSet.number,
                points_a: gameDetails.points_a,
                points_b: gameDetails.points_b,
                server: gameDetails.server,
                serves_left: gameDetails.serves_left,
                service_points_a: gameDetails.service_points_a,
                service_points_b: gameDetails.service_points_b,
                return_points_a: gameDetails.return_points_a,
                return_points_b: gameDetails.return_points_b,
                errors_a: gameDetails.errors_a,
                errors_b: gameDetails.errors_b
              } : undefined)
              return
            }
          }

          // Se não precisar trocar de set, apenas atualiza os dados
          setTableTennisData(prev => prev ? {
            ...prev,
            current_set: gameDetails.current_set,
            points_a: gameDetails.points_a,
            points_b: gameDetails.points_b,
            server: gameDetails.server,
            serves_left: gameDetails.serves_left,
            service_points_a: gameDetails.service_points_a,
            service_points_b: gameDetails.service_points_b,
            return_points_a: gameDetails.return_points_a,
            return_points_b: gameDetails.return_points_b,
            errors_a: gameDetails.errors_a,
            errors_b: gameDetails.errors_b
          } : undefined)
        }
      } catch (error) {
        console.error('Erro ao atualizar detalhes do jogo:', error)
      }
    }

    // Buscar detalhes imediatamente
    fetchTableTennisDetails()

    // Configurar intervalo para atualizar a cada 2 segundos
    const interval = setInterval(fetchTableTennisDetails, 2000)

    // Limpar intervalo quando o componente for desmontado
    return () => clearInterval(interval)
  }, [game.id, tableTennisData?.sets])

  const handleClick = () => {
    setShowDetails(true)
    onClick()
  }

  return (
    <>
      <div
        onClick={handleClick}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      >
        <div className="p-3 sm:p-4">
          {/* Cabeçalho do Jogo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {game.game_time} - {game.period}
              </span>
              <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                {game.category}
              </span>
            </div>
          </div>

          {/* Placar Principal */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex-1">
              <div className="text-center">
                <p className="text-sm sm:text-base font-medium dark:text-white mb-1 sm:mb-2 truncate">
                  {game.team_a_name}
                </p>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {game.score_a}
                </div>
                {tableTennisData?.server === 'A' && (
                  <div className="mt-1">
                    <span className="text-xs sm:text-sm text-yellow-500 dark:text-yellow-400">
                      Saque
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="px-2 sm:px-4">
              <span className="text-base sm:text-lg font-medium text-gray-400 dark:text-gray-500">
                vs
              </span>
            </div>
            <div className="flex-1">
              <div className="text-center">
                <p className="text-sm sm:text-base font-medium dark:text-white mb-1 sm:mb-2 truncate">
                  {game.team_b_name}
                </p>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {game.score_b}
                </div>
                {tableTennisData?.server === 'B' && (
                  <div className="mt-1">
                    <span className="text-xs sm:text-sm text-yellow-500 dark:text-yellow-400">
                      Saque
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sets */}
          {tableTennisData && (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 sm:p-3 mb-4">
              <div className="flex justify-center gap-3 sm:gap-4">
                {tableTennisData.sets.map((set, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {set.number}º Set
                    </div>
                    <div className={`bg-white dark:bg-gray-800 rounded py-1 sm:py-2 px-2 sm:px-3 ${
                      set.status === 'in_progress' ? 'ring-2 ring-blue-500' : ''
                    }`}>
                      <span className="text-xs sm:text-sm font-medium dark:text-white">
                        {set.status !== 'not_started' ? `${set.score_a}-${set.score_b}` : '-'}
                      </span>
                    </div>
                    {set.winner && (
                      <div className="mt-1">
                        <span className={`text-xs font-medium ${
                          set.winner === 'A' ? 'text-green-500' : 'text-blue-500'
                        }`}>
                          {set.winner === 'A' ? '●' : '○'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pontuação Atual e Serviço */}
              {tableTennisData.current_set > 0 && (
                <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center mb-2">
                    Set {tableTennisData.current_set} - Pontos para vencer: {
                      tableTennisData.current_set === tableTennisData.sets.length ? config.points_last_set : config.points_per_set
                    }
                  </div>
                  <div className="flex justify-center items-center space-x-4">
                    <span className="text-lg sm:text-xl font-bold dark:text-white">
                      {tableTennisData.points_a}
                    </span>
                    <span className="text-gray-400">-</span>
                    <span className="text-lg sm:text-xl font-bold dark:text-white">
                      {tableTennisData.points_b}
                    </span>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Saques restantes: {tableTennisData.serves_left}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Informações do Jogo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="truncate">{game.location}</span>
              <span>•</span>
              <span>Melhor de {config.total_sets} sets</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span>Ao Vivo</span>
            </div>
          </div>

          {/* Highlights */}
          {(game.highlights?.length ?? 0) > 0 && (
            <div className="mt-3 sm:mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4">
              {game.highlights?.slice(0, 3).map((event, index) => (
                <div key={index} className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                  <span>{new Date(event.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>-</span>
                  <span className="truncate">{event.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {showDetails && (
        <TableTennisGameDetails
          game={game}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  )
} 