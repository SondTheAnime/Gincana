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

      if (newScoreA >= pointsToWin && newScoreA - newScoreB >= minDifference) {
        winner = 'A'
      } else if (newScoreB >= pointsToWin && newScoreB - newScoreA >= minDifference) {
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

        // Atualizar o placar geral do jogo
        const { error: gameError } = await supabase
          .from('games')
          .update({
            score_a: setsA,
            score_b: setsB,
            status: Math.max(setsA, setsB) > game.config.total_sets / 2 ? 'finished' : 'in_progress'
          })
          .eq('id', game.id)

        if (gameError) throw gameError
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

      // Atualizar o estado local do jogo
      onUpdateGame({
        ...game,
        sets: game.sets.map(s => 
          s.id === currentSet.id 
            ? { ...s, score_a: newScoreA, score_b: newScoreB }
            : s
        )
      })

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
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Pontuação Atual - Set {currentSet.set_number}
      </h3>

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