import { useState } from 'react'
import { supabase } from '../../../../../../lib/supabase'
import { toast } from 'react-toastify'
import { VolleyballGame } from '../types'
import { Plus, Minus } from 'lucide-react'

interface VolleyballSetsProps {
  game: VolleyballGame
  onUpdateGame: (game: VolleyballGame) => void
}

const VolleyballSets = ({ game, onUpdateGame }: VolleyballSetsProps) => {
  const [loading, setLoading] = useState(false)

  if (!game.sets) return null

  const handleUpdateSet = async (setNumber: number, team: 'A' | 'B', action: 'add' | 'remove') => {
    setLoading(true)
    try {
      const currentSet = game.sets.find(s => s.set_number === setNumber)
      if (!currentSet) throw new Error('Set não encontrado')

      // Atualizar pontos
      const newPoints = action === 'add' 
        ? (team === 'A' ? currentSet.score_a + 1 : currentSet.score_b + 1)
        : (team === 'A' ? Math.max(0, currentSet.score_a - 1) : Math.max(0, currentSet.score_b - 1))

      // Verificar se o set foi vencido
      const pointsToWin = setNumber === game.config.total_sets ? game.config.points_last_set : game.config.points_per_set
      const minDifference = game.config.min_difference
      const otherTeamPoints = team === 'A' ? currentSet.score_b : currentSet.score_a
      const isSetWon = newPoints >= pointsToWin && (newPoints - otherTeamPoints) >= minDifference

      // Atualizar o set no banco de dados
      const { error } = await supabase
        .from('game_sets')
        .update({
          score_a: team === 'A' ? newPoints : currentSet.score_a,
          score_b: team === 'B' ? newPoints : currentSet.score_b,
          winner: isSetWon ? team : null,
          status: isSetWon ? 'finished' as const : 'in_progress' as const
        })
        .eq('id', currentSet.id)

      if (error) throw error

      // Atualizar o estado do jogo com os novos valores
      const updatedSet = {
        ...currentSet,
        score_a: team === 'A' ? newPoints : currentSet.score_a,
        score_b: team === 'B' ? newPoints : currentSet.score_b,
        winner: isSetWon ? team : null,
        status: isSetWon ? 'finished' as const : 'in_progress' as const
      }

      // Atualizar o estado do jogo
      const updatedSets = game.sets.map(s => 
        s.set_number === setNumber ? updatedSet : s
      )

      // Verificar se o jogo foi vencido
      const setsWonByA = updatedSets.filter(s => s.winner === 'A').length
      const setsWonByB = updatedSets.filter(s => s.winner === 'B').length
      const setsToWin = Math.ceil(game.config.total_sets / 2)

      if (setsWonByA === setsToWin || setsWonByB === setsToWin) {
        // Atualizar o status do jogo para finalizado
        const { error: gameError } = await supabase
          .from('games')
          .update({ period: 'finished' })
          .eq('id', game.id)

        if (gameError) throw gameError

        onUpdateGame({
          ...game,
          sets: updatedSets,
          period: 'finished'
        })
      } else {
        onUpdateGame({
          ...game,
          sets: updatedSets
        })
      }

      toast.success('Set atualizado com sucesso')
    } catch (error) {
      console.error('Erro ao atualizar set:', error)
      toast.error('Erro ao atualizar set')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sets</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {game.sets.map((set) => (
          <div 
            key={set.id}
            className={`p-4 rounded-lg border ${
              set.winner 
                ? 'border-green-500 dark:border-green-600' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="text-center mb-2">
              <span className="text-sm font-medium">Set {set.set_number}</span>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {set.winner ? (
                  <span>
                    Vencedor: {set.winner === 'A' ? game.team_a_name : game.team_b_name}
                  </span>
                ) : (
                  <span>Em andamento</span>
                )}
              </div>
            </div>

            {/* Time A */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">{game.team_a_name}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateSet(set.set_number, 'A', 'remove')}
                  disabled={loading || set.winner !== null || set.score_a === 0}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-semibold min-w-[2ch] text-center">
                  {set.score_a}
                </span>
                <button
                  onClick={() => handleUpdateSet(set.set_number, 'A', 'add')}
                  disabled={loading || set.winner !== null}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Time B */}
            <div className="flex items-center justify-between">
              <span className="text-sm">{game.team_b_name}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateSet(set.set_number, 'B', 'remove')}
                  disabled={loading || set.winner !== null || set.score_b === 0}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-semibold min-w-[2ch] text-center">
                  {set.score_b}
                </span>
                <button
                  onClick={() => handleUpdateSet(set.set_number, 'B', 'add')}
                  disabled={loading || set.winner !== null}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VolleyballSets 