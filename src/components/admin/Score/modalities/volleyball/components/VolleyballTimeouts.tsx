import { useEffect, useState } from 'react'
import { supabase } from '../../../../../../lib/supabase'
import { VolleyballGame } from '../types'

interface VolleyballTimeoutsProps {
  game: VolleyballGame
  onUpdateGame: (game: VolleyballGame) => void
}

const VolleyballTimeouts = ({ game, onUpdateGame }: VolleyballTimeoutsProps) => {
  const [timeoutsTeamA, setTimeoutsTeamA] = useState(0)
  const [timeoutsTeamB, setTimeoutsTeamB] = useState(0)

  // Atualizar contagem de timeouts quando houver mudanças
  useEffect(() => {
    const currentSet = game.sets.find(s => s.set_number === game.details.current_set)
    if (!currentSet) return

    // Buscar timeouts atualizados
    const fetchTimeouts = async () => {
      const { data: timeouts } = await supabase
        .from('game_events')
        .select('*')
        .eq('game_id', game.id)
        .eq('type', 'timeout')
        .order('created_at', { ascending: false })

      if (timeouts) {
        // Filtrar timeouts do set atual
        const teamATimeouts = timeouts.filter(h => 
          h.team === 'A' && 
          h.description === `timeout_set_${currentSet.set_number}`
        ).length

        const teamBTimeouts = timeouts.filter(h => 
          h.team === 'B' && 
          h.description === `timeout_set_${currentSet.set_number}`
        ).length

        setTimeoutsTeamA(teamATimeouts)
        setTimeoutsTeamB(teamBTimeouts)

        // Atualizar o jogo com os novos highlights
        if (timeouts !== game.highlights) {
          onUpdateGame({
            ...game,
            highlights: timeouts
          })
        }
      }
    }

    // Buscar timeouts iniciais
    fetchTimeouts()

    // Escutar por mudanças nos eventos
    const channel = supabase
      .channel('game_events_timeouts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_events',
          filter: `game_id=eq.${game.id} AND type=eq.timeout`
        },
        () => {
          // Atualizar timeouts quando houver mudanças
          fetchTimeouts()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [game.id, game.details.current_set])

  const currentSet = game.sets.find(s => s.set_number === game.details.current_set)
  if (!currentSet) return null

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Timeouts - Set {currentSet.set_number}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Time A */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {game.team_a_name}
          </h4>
          <div className="flex gap-2">
            {Array.from({ length: game.config.max_timeouts }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full ${
                  i < timeoutsTeamA
                    ? 'bg-red-500'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {timeoutsTeamA} de {game.config.max_timeouts} timeouts usados
          </p>
        </div>

        {/* Time B */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {game.team_b_name}
          </h4>
          <div className="flex gap-2">
            {Array.from({ length: game.config.max_timeouts }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full ${
                  i < timeoutsTeamB
                    ? 'bg-red-500'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {timeoutsTeamB} de {game.config.max_timeouts} timeouts usados
          </p>
        </div>
      </div>
    </div>
  )
}

export default VolleyballTimeouts 