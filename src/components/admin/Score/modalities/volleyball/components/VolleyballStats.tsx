import { useState, useEffect } from 'react'
import { supabase } from '../../../../../../lib/supabase'
import { toast } from 'react-toastify'
import { VolleyballGame } from '../types'
import { Player } from '../../../types'

interface VolleyballStats {
  id: number
  game_id: number
  team_a_points: number
  team_b_points: number
  team_a_aces: number
  team_b_aces: number
  team_a_blocks: number
  team_b_blocks: number
  team_a_attacks: number
  team_b_attacks: number
  team_a_errors: number
  team_b_errors: number
}

interface PlayerStats {
  id: number
  game_id: number
  player_id: number
  points: number
  aces: number
  blocks: number
  attacks: number
  errors: number
  player: Player
}

interface VolleyballStatsProps {
  game: VolleyballGame
}

const VolleyballStats = ({ game }: VolleyballStatsProps) => {
  const [loading, setLoading] = useState(true)
  const [gameStats, setGameStats] = useState<VolleyballStats | null>(null)
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Buscar estatísticas do jogo
        const { data: stats, error: statsError } = await supabase
          .from('volleyball_game_stats')
          .select('*')
          .eq('game_id', game.id)
          .single()

        if (statsError) throw statsError

        // Buscar estatísticas dos jogadores
        const { data: pStats, error: pStatsError } = await supabase
          .from('volleyball_player_stats')
          .select(`
            *,
            player:players (*)
          `)
          .eq('game_id', game.id)

        if (pStatsError) throw pStatsError

        setGameStats(stats)
        setPlayerStats(pStats)
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
        toast.error('Erro ao carregar estatísticas')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [game.id])

  if (loading) return null

  return (
    <div className="space-y-6">
      {/* Estatísticas do Jogo */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Estatísticas do Jogo
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {game.team_a_name}
            </h4>
            <div className="mt-2 space-y-1 text-sm">
              <p>Pontos: {gameStats?.team_a_points || 0}</p>
              <p>Aces: {gameStats?.team_a_aces || 0}</p>
              <p>Bloqueios: {gameStats?.team_a_blocks || 0}</p>
              <p>Ataques: {gameStats?.team_a_attacks || 0}</p>
              <p>Erros: {gameStats?.team_a_errors || 0}</p>
            </div>
          </div>

          <div className="text-center">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Comparativo
            </h4>
            <div className="mt-2 space-y-1 text-sm">
              <p>{gameStats?.team_a_points || 0} - {gameStats?.team_b_points || 0}</p>
              <p>{gameStats?.team_a_aces || 0} - {gameStats?.team_b_aces || 0}</p>
              <p>{gameStats?.team_a_blocks || 0} - {gameStats?.team_b_blocks || 0}</p>
              <p>{gameStats?.team_a_attacks || 0} - {gameStats?.team_b_attacks || 0}</p>
              <p>{gameStats?.team_a_errors || 0} - {gameStats?.team_b_errors || 0}</p>
            </div>
          </div>

          <div className="text-center">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {game.team_b_name}
            </h4>
            <div className="mt-2 space-y-1 text-sm">
              <p>Pontos: {gameStats?.team_b_points || 0}</p>
              <p>Aces: {gameStats?.team_b_aces || 0}</p>
              <p>Bloqueios: {gameStats?.team_b_blocks || 0}</p>
              <p>Ataques: {gameStats?.team_b_attacks || 0}</p>
              <p>Erros: {gameStats?.team_b_errors || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas dos Jogadores */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Estatísticas dos Jogadores
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Time A */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              {game.team_a_name}
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500">
                    <th className="px-2 py-1 text-left">Jogador</th>
                    <th className="px-2 py-1 text-center">P</th>
                    <th className="px-2 py-1 text-center">A</th>
                    <th className="px-2 py-1 text-center">B</th>
                    <th className="px-2 py-1 text-center">At</th>
                    <th className="px-2 py-1 text-center">E</th>
                  </tr>
                </thead>
                <tbody>
                  {playerStats
                    .filter(ps => ps.player.team_id === game.team_a)
                    .map(ps => (
                      <tr key={ps.id} className="text-sm">
                        <td className="px-2 py-1">
                          {ps.player.number} - {ps.player.name}
                        </td>
                        <td className="px-2 py-1 text-center">{ps.points}</td>
                        <td className="px-2 py-1 text-center">{ps.aces}</td>
                        <td className="px-2 py-1 text-center">{ps.blocks}</td>
                        <td className="px-2 py-1 text-center">{ps.attacks}</td>
                        <td className="px-2 py-1 text-center">{ps.errors}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Time B */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              {game.team_b_name}
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500">
                    <th className="px-2 py-1 text-left">Jogador</th>
                    <th className="px-2 py-1 text-center">P</th>
                    <th className="px-2 py-1 text-center">A</th>
                    <th className="px-2 py-1 text-center">B</th>
                    <th className="px-2 py-1 text-center">At</th>
                    <th className="px-2 py-1 text-center">E</th>
                  </tr>
                </thead>
                <tbody>
                  {playerStats
                    .filter(ps => ps.player.team_id === game.team_b)
                    .map(ps => (
                      <tr key={ps.id} className="text-sm">
                        <td className="px-2 py-1">
                          {ps.player.number} - {ps.player.name}
                        </td>
                        <td className="px-2 py-1 text-center">{ps.points}</td>
                        <td className="px-2 py-1 text-center">{ps.aces}</td>
                        <td className="px-2 py-1 text-center">{ps.blocks}</td>
                        <td className="px-2 py-1 text-center">{ps.attacks}</td>
                        <td className="px-2 py-1 text-center">{ps.errors}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VolleyballStats 