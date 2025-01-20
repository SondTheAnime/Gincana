import { useState } from 'react'
import { supabase } from '../../../../../../lib/supabase'
import { toast } from 'sonner'
import { TableTennisGame } from '../types'
import { Clock } from 'lucide-react'

interface TableTennisTimeoutsProps {
  game: TableTennisGame
  onUpdateGame: (game: TableTennisGame) => void
}

export const TableTennisTimeouts = ({ game, onUpdateGame }: TableTennisTimeoutsProps) => {
  const [loading, setLoading] = useState(false)

  const currentSet = game.sets.find(s => s.set_number === game.details.current_set)

  // Calcular timeouts disponíveis para cada time no set atual
  const timeoutsTeamA = (game.highlights || [])
    .filter(h => 
      h.type === 'timeout' && 
      h.team === 'A' && 
      h.description === `timeout_set_${currentSet?.set_number}`
    )
    .length

  const timeoutsTeamB = (game.highlights || [])
    .filter(h => 
      h.type === 'timeout' && 
      h.team === 'B' && 
      h.description === `timeout_set_${currentSet?.set_number}`
    )
    .length

  const handleTimeout = async (team: 'A' | 'B') => {
    if (!currentSet || loading) return

    try {
      setLoading(true)

      // Verificar se o time ainda tem timeouts disponíveis
      const timeoutsUsed = team === 'A' ? timeoutsTeamA : timeoutsTeamB
      if (timeoutsUsed >= game.config.max_timeouts) {
        toast.error(`${team === 'A' ? game.team_a_name : game.team_b_name} já usou todos os timeouts deste set`)
        return
      }

      // Criar evento de timeout
      const { error: eventError } = await supabase
        .from('game_events')
        .insert([{
          game_id: game.id,
          type: 'timeout',
          team,
          description: `timeout_set_${currentSet.set_number}`
        }])

      if (eventError) throw eventError

      // Buscar todos os highlights atualizados
      const { data: updatedHighlights, error: highlightsError } = await supabase
        .from('game_events')
        .select('*')
        .eq('game_id', game.id)
        .order('created_at', { ascending: false })

      if (highlightsError) throw highlightsError

      // Atualizar o estado local do jogo
      onUpdateGame({
        ...game,
        highlights: updatedHighlights || []
      })

      toast.success('Timeout registrado com sucesso')
    } catch (error) {
      console.error('Erro ao registrar timeout:', error)
      toast.error('Erro ao registrar timeout')
    } finally {
      setLoading(false)
    }
  }

  if (!currentSet) return null

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Timeouts - Set {currentSet.set_number}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {game.team_a_name}
          </h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTimeout('A')}
              disabled={loading || currentSet.status === 'finished' || timeoutsTeamA >= game.config.max_timeouts}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/40 disabled:opacity-50"
            >
              <Clock size={16} />
              Timeout ({timeoutsTeamA}/{game.config.max_timeouts})
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {game.team_b_name}
          </h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTimeout('B')}
              disabled={loading || currentSet.status === 'finished' || timeoutsTeamB >= game.config.max_timeouts}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/40 disabled:opacity-50"
            >
              <Clock size={16} />
              Timeout ({timeoutsTeamB}/{game.config.max_timeouts})
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 