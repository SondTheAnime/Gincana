import { useState } from 'react'
import { supabase } from '../../../../../../lib/supabase'
import { toast } from 'react-toastify'
import { VolleyballGame } from '../types'

interface VolleyballPointsProps {
  game: VolleyballGame
  onUpdateGame: (game: VolleyballGame) => void
}

const VolleyballPoints = ({ game, onUpdateGame }: VolleyballPointsProps) => {
  const [updating, setUpdating] = useState(false)
  const currentSet = game.sets.find(s => s.set_number === game.details.current_set)

  const handlePointChange = async (team: 'A' | 'B', value: number) => {
    if (!currentSet || updating) return

    setUpdating(true)
    try {
      const newPoints = Math.max(0, value)
      const pointsNeeded = game.config.points_per_set
      const isLastSet = currentSet.set_number === game.config.total_sets
      const pointsToWin = isLastSet && game.config.points_last_set ? game.config.points_last_set : pointsNeeded

      // Atualizar pontos do set atual
      const { error: setError } = await supabase
        .from('game_sets')
        .update({
          score_a: team === 'A' ? newPoints : currentSet.score_a,
          score_b: team === 'B' ? newPoints : currentSet.score_b,
          status: 'in_progress'
        })
        .eq('id', currentSet.id)

      if (setError) throw setError

      // Verificar se o set terminou
      const teamAPoints = team === 'A' ? newPoints : currentSet.score_a
      const teamBPoints = team === 'B' ? newPoints : currentSet.score_b
      const pointsDiff = Math.abs(teamAPoints - teamBPoints)
      const maxPoints = Math.max(teamAPoints, teamBPoints)

      if (maxPoints >= pointsToWin && pointsDiff >= game.config.min_difference) {
        const winner = teamAPoints > teamBPoints ? 'A' : 'B'
        
        // Finalizar o set atual
        const { error: finishError } = await supabase
          .from('game_sets')
          .update({
            status: 'finished',
            winner
          })
          .eq('id', currentSet.id)

        if (finishError) throw finishError

        // Atualizar detalhes do jogo
        const nextSet = game.sets.find(s => s.set_number === currentSet.set_number + 1)
        if (nextSet) {
          const { error: detailsError } = await supabase
            .from('volleyball_game_details')
            .update({
              current_set: nextSet.set_number,
              points_a: 0,
              points_b: 0
            })
            .eq('id', game.details.id)

          if (detailsError) throw detailsError

          // Atualizar estado local
          onUpdateGame({
            ...game,
            details: {
              ...game.details,
              current_set: nextSet.set_number,
              points_a: 0,
              points_b: 0
            },
            sets: game.sets.map(s => 
              s.id === currentSet.id 
                ? { ...s, status: 'finished', winner, score_a: teamAPoints, score_b: teamBPoints }
                : s
            )
          })
        }
      } else {
        // Atualizar estado local
        onUpdateGame({
          ...game,
          sets: game.sets.map(s => 
            s.id === currentSet.id 
              ? { 
                  ...s, 
                  score_a: team === 'A' ? newPoints : s.score_a,
                  score_b: team === 'B' ? newPoints : s.score_b
                }
              : s
          )
        })
      }
    } catch (error) {
      console.error('Erro ao atualizar pontos:', error)
      toast.error('Erro ao atualizar pontos. Tente novamente.')
    } finally {
      setUpdating(false)
    }
  }

  if (!currentSet) return null

  return (
    <div className="grid grid-cols-3 gap-4 sm:gap-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="text-center">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
          {game.team_a_name}
        </h3>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handlePointChange('A', currentSet.score_a - 1)}
            disabled={updating || currentSet.score_a === 0}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            -
          </button>
          <input
            type="number"
            value={currentSet.score_a}
            onChange={(e) => handlePointChange('A', parseInt(e.target.value))}
            min="0"
            disabled={updating}
            className="w-20 text-center text-3xl font-bold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-2"
          />
          <button
            onClick={() => handlePointChange('A', currentSet.score_a + 1)}
            disabled={updating}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>

      <div className="text-center flex flex-col justify-center">
        <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
          Set {currentSet.set_number}
        </span>
        <span className="text-sm text-gray-500">
          {currentSet.set_number === game.config.total_sets 
            ? `Até ${game.config.points_last_set} pontos`
            : `Até ${game.config.points_per_set} pontos`
          }
        </span>
      </div>

      <div className="text-center">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
          {game.team_b_name}
        </h3>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handlePointChange('B', currentSet.score_b - 1)}
            disabled={updating || currentSet.score_b === 0}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            -
          </button>
          <input
            type="number"
            value={currentSet.score_b}
            onChange={(e) => handlePointChange('B', parseInt(e.target.value))}
            min="0"
            disabled={updating}
            className="w-20 text-center text-3xl font-bold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-2"
          />
          <button
            onClick={() => handlePointChange('B', currentSet.score_b + 1)}
            disabled={updating}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

export default VolleyballPoints 