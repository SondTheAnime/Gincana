import { useState, useEffect } from 'react'
import { supabase } from '../../../../../lib/supabase'
import { User } from 'lucide-react'

interface Player {
  id: number
  name: string
  number: number
  position: string
  is_starter: boolean
  is_captain: boolean
}

interface VolleyTeamLineupProps {
  teamId: string | number
}

export const VolleyTeamLineup = ({ teamId }: VolleyTeamLineupProps) => {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .eq('team_id', teamId)
          .order('is_starter', { ascending: false })
          .order('number')

        if (error) throw error
        setPlayers(data || [])
      } catch (error) {
        console.error('Erro ao buscar jogadores:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlayers()
  }, [teamId])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-12 bg-gray-100 dark:bg-gray-800 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  const starters = players.filter(p => p.is_starter)
  const reserves = players.filter(p => !p.is_starter)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
      {/* Titulares */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          Titulares
        </h4>
        <div className="space-y-2">
          {starters.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {player.name} {player.is_captain && '(C)'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {player.position}
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                #{player.number}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reservas */}
      <div>
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          Reservas
        </h4>
        <div className="space-y-2">
          {reserves.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {player.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {player.position}
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                #{player.number}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 