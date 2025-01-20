import { useState } from 'react'
import { supabase } from '../../../../../../lib/supabase'
import { toast } from 'sonner'
import { TableTennisGame } from '../types'
import { Plus, Minus } from 'lucide-react'

interface TableTennisPointsProps {
  game: TableTennisGame
  onUpdateGame: (game: TableTennisGame) => void
}

export const TableTennisPoints = ({ game, onUpdateGame }: TableTennisPointsProps) => {
  const [loading, setLoading] = useState(false)

  const currentSet = game.sets.find(s => s.set_number === game.details.current_set)

  const handleUpdatePoints = async (team: 'A' | 'B', action: 'add' | 'remove') => {
    if (!currentSet || loading) return
    
    try {
      setLoading(true)

      // Calcular novos pontos
      const newScoreA = team === 'A' 
        ? currentSet.score_a + (action === 'add' ? 1 : -1)
        : currentSet.score_a
      const newScoreB = team === 'B'
        ? currentSet.score_b + (action === 'add' ? 1 : -1)
        : currentSet.score_b

      // Não permitir pontuação negativa
      if (newScoreA < 0 || newScoreB < 0) return

      // Verificar se algum time venceu o set
      let winner = null
      const pointsToWin = game.config.points_per_set
      const minDifference = game.config.min_difference

      if (
        (newScoreA === pointsToWin && newScoreA - newScoreB >= minDifference) ||
        (newScoreA > pointsToWin && newScoreA - newScoreB >= minDifference)
      ) {
        winner = 'A'
      } else if (
        (newScoreB === pointsToWin && newScoreB - newScoreA >= minDifference) ||
        (newScoreB > pointsToWin && newScoreB - newScoreA >= minDifference)
      ) {
        winner = 'B'
      }

      // Atualizar o set
      const { error: setError } = await supabase
        .from('game_sets')
        .update({
          score_a: newScoreA,
          score_b: newScoreB,
          status: winner ? 'finished' : 'in_progress',
          winner: winner || undefined
        })
        .eq('id', currentSet.id)

      if (setError) throw setError

      // Se o set foi finalizado, atualizar o placar geral do jogo
      if (winner) {
        // Contar sets vencidos por cada time
        const setsA = game.sets.filter(s => s.winner === 'A').length + (winner === 'A' ? 1 : 0)
        const setsB = game.sets.filter(s => s.winner === 'B').length + (winner === 'B' ? 1 : 0)

        // Calcular sets restantes
        const setsRestantes = game.config.total_sets - game.sets.filter(s => s.status === 'finished').length
        
        // Verificar se ainda é possível vencer
        const setsNecessariosParaVencer = Math.ceil(game.config.total_sets / 2)
        const timeAPodeVencer = setsA + setsRestantes >= setsNecessariosParaVencer
        const timeBPodeVencer = setsB + setsRestantes >= setsNecessariosParaVencer

        // Definir se o jogo acabou
        const isGameFinished = Math.max(setsA, setsB) > game.config.total_sets / 2 || 
                             (!timeAPodeVencer || !timeBPodeVencer)

        // Definir vencedor se o jogo acabou por impossibilidade matemática
        const gameWinner = isGameFinished ? (setsA > setsB ? 'A' : 'B') : undefined
        const newGameStatus = isGameFinished ? 'finished' : 'live'

        // Atualizar o placar geral e status do jogo
        const { error: gameError } = await supabase
          .from('games')
          .update({
            score_a: setsA,
            score_b: setsB,
            status: newGameStatus,
            period: isGameFinished ? 'finished' : 'in_progress',
            winner: gameWinner
          })
          .eq('id', game.id)

        if (gameError) throw gameError

        // Se o jogo não acabou, avançar para o próximo set
        if (!isGameFinished) {
          const nextSetNumber = currentSet.set_number + 1
          const nextSet = game.sets.find(s => s.set_number === nextSetNumber)

          if (nextSet) {
            // Atualizar o set atual nos detalhes do jogo
            const { error: detailsError } = await supabase
              .from('table_tennis_game_details')
              .update({
                current_set: nextSetNumber
              })
              .eq('game_id', game.id)

            if (detailsError) throw detailsError

            // Atualizar o estado local
            onUpdateGame({
              ...game,
              status: newGameStatus,
              period: 'in_progress',
              score_a: setsA,
              score_b: setsB,
              details: {
                ...game.details,
                current_set: nextSetNumber
              }
            })

            if (!timeAPodeVencer || !timeBPodeVencer) {
              toast.success(`Jogo finalizado! ${gameWinner === 'A' ? game.team_a_name : game.team_b_name} venceu por impossibilidade matemática do adversário.`)
            }
          }
        } else {
          // Atualizar o estado local quando o jogo acabar
          onUpdateGame({
            ...game,
            status: newGameStatus,
            period: 'finished',
            score_a: setsA,
            score_b: setsB,
            winner: gameWinner
          })

          if (!timeAPodeVencer || !timeBPodeVencer) {
            toast.success(`Jogo finalizado! ${gameWinner === 'A' ? game.team_a_name : game.team_b_name} venceu por impossibilidade matemática do adversário.`)
          }
        }
      } else {
        // Atualizar o estado local quando não houver vencedor
        onUpdateGame({
          ...game,
          sets: game.sets.map(s => 
            s.id === currentSet.id 
              ? { ...s, score_a: newScoreA, score_b: newScoreB }
              : s
          )
        })
      }

      // Criar evento de ponto
      const { error: eventError } = await supabase
        .from('game_events')
        .insert([{
          game_id: game.id,
          type: 'point',
          team,
          description: 'point'
        }])

      if (eventError) throw eventError

    } catch (error) {
      console.error('Erro ao atualizar pontos:', error)
      toast.error('Erro ao atualizar pontos')
    } finally {
      setLoading(false)
    }
  }

  if (!currentSet) return null

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Pontuação Atual - Set {currentSet.set_number}
        </h3>

        <select
          value={currentSet.set_number}
          onChange={async (e) => {
            try {
              setLoading(true)
              const newSetNumber = Number(e.target.value)

              // Atualizar o set atual nos detalhes do jogo
              const { error: detailsError } = await supabase
                .from('table_tennis_game_details')
                .update({
                  current_set: newSetNumber
                })
                .eq('game_id', game.id)

              if (detailsError) throw detailsError

              // Atualizar o estado local
              onUpdateGame({
                ...game,
                details: {
                  ...game.details,
                  current_set: newSetNumber
                }
              })

              toast.success(`Alterado para o Set ${newSetNumber}`)
            } catch (error) {
              console.error('Erro ao mudar de set:', error)
              toast.error('Erro ao mudar de set')
            } finally {
              setLoading(false)
            }
          }}
          className="text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-1 px-2 focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
        >
          {game.sets.map((set) => (
            <option key={set.set_number} value={set.set_number}>
              Set {set.set_number} {set.status === 'finished' ? '(Finalizado)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {game.team_a_name}
          </h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleUpdatePoints('A', 'remove')}
              disabled={loading || currentSet.status === 'finished'}
              className="p-1 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 disabled:opacity-50"
            >
              <Minus size={20} />
            </button>
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              {currentSet.score_a}
            </span>
            <button
              onClick={() => handleUpdatePoints('A', 'add')}
              disabled={loading || currentSet.status === 'finished'}
              className="p-1 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 disabled:opacity-50"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {game.team_b_name}
          </h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleUpdatePoints('B', 'remove')}
              disabled={loading || currentSet.status === 'finished'}
              className="p-1 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 disabled:opacity-50"
            >
              <Minus size={20} />
            </button>
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              {currentSet.score_b}
            </span>
            <button
              onClick={() => handleUpdatePoints('B', 'add')}
              disabled={loading || currentSet.status === 'finished'}
              className="p-1 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 disabled:opacity-50"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 