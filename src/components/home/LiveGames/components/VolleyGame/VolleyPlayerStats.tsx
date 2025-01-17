import { useState, useEffect } from 'react'
import { supabase } from '../../../../../lib/supabase'
import { TrendingUp } from 'lucide-react'

interface PlayerStats {
  player_id: number
  player_name: string
  player_number: number
  attacks: number
  blocks: number
  serves: number
  aces: number
  digs: number
  assists: number
}

interface PlayerStatsResponse {
  player_id: number
  players: {
    name: string
    number: number
  }
  attacks: number
  blocks: number
  serves: number
  aces: number
  digs: number
  assists: number
}

interface VolleyPlayerStatsProps {
  teamId: string | number
}

export const VolleyPlayerStats = ({ teamId }: VolleyPlayerStatsProps) => {
  const [stats, setStats] = useState<PlayerStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('volleyball_player_stats')
          .select(`
            player_id,
            players:players!inner (
              name,
              number
            ),
            attacks,
            blocks,
            serves,
            aces,
            digs,
            assists
          `)
          .eq('team_id', teamId)
          .order('attacks', { ascending: false })

        if (error) throw error

        const formattedStats = (data as unknown as PlayerStatsResponse[]).map(stat => ({
          player_id: stat.player_id,
          player_name: stat.players.name,
          player_number: stat.players.number,
          attacks: stat.attacks,
          blocks: stat.blocks,
          serves: stat.serves,
          aces: stat.aces,
          digs: stat.digs,
          assists: stat.assists
        }))

        setStats(formattedStats)
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [teamId])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-12 bg-gray-100 dark:bg-gray-800 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <h4 className="text-base font-semibold text-gray-900 dark:text-white">
          Estatísticas
        </h4>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Jogador
              </th>
              <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ataques
              </th>
              <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Bloqueios
              </th>
              <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Saques
              </th>
              <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Aces
              </th>
              <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Defesas
              </th>
              <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Assistências
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {stats.map((player) => (
              <tr key={player.player_id}>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {player.player_name}
                    </div>
                    <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      #{player.player_number}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                  {player.attacks}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                  {player.blocks}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                  {player.serves}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                  {player.aces}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                  {player.digs}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                  {player.assists}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 