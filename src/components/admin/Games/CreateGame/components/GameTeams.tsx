import { useEffect, useState } from 'react'
import { StepProps, Team, Player } from '../types'
import { supabase } from '../../../../../lib/supabase'
import { toast } from 'sonner'

export const GameTeams = ({ formData, setFormData }: StepProps) => {
  const [teams, setTeams] = useState<Team[]>([])
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    if (formData.sport === 'Tênis de Mesa') {
      fetchPlayers()
    } else {
      fetchTeams()
    }
  }, [formData.sport])

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name')

      if (error) throw error
      setTeams(data)
    } catch (error) {
      console.error('Erro ao buscar times:', error)
      toast.error('Erro ao carregar times')
    }
  }

  const fetchPlayers = async () => {
    try {
      type PlayerResponse = {
        id: number
        name: string
        team_id: number
        teams: {
          name: string
        }
      }

      const { data, error } = await supabase
        .from('players')
        .select(`
          id,
          name,
          team_id,
          teams!inner (
            name
          )
        `)
        .returns<PlayerResponse[]>()
        .order('name')

      if (error) throw error
      setPlayers(data.map(player => ({
        id: player.id,
        name: player.name,
        team_id: player.team_id,
        team_name: player.teams.name
      })))
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error)
      toast.error('Erro ao carregar jogadores')
    }
  }

  const filteredTeams = teams.filter(team => team.modality === formData.sport)

  if (formData.sport === 'Tênis de Mesa') {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Jogador A
          </label>
          <select
            value={formData.player_a}
            onChange={(e) => setFormData({ ...formData, player_a: Number(e.target.value) })}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
            required
          >
            <option value="">Selecione o jogador</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} - {player.team_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Jogador B
          </label>
          <select
            value={formData.player_b}
            onChange={(e) => setFormData({ ...formData, player_b: Number(e.target.value) })}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
            required
          >
            <option value="">Selecione o jogador</option>
            {players
              .filter(player => player.id !== formData.player_a)
              .map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name} - {player.team_name}
                </option>
              ))}
          </select>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Time A
        </label>
        <select
          value={formData.team_a}
          onChange={(e) => setFormData({ ...formData, team_a: Number(e.target.value) })}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
          required
        >
          <option value={0}>Selecione o time</option>
          {filteredTeams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name} - {team.category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Time B
        </label>
        <select
          value={formData.team_b}
          onChange={(e) => setFormData({ ...formData, team_b: Number(e.target.value) })}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
          required
        >
          <option value={0}>Selecione o time</option>
          {filteredTeams
            .filter(team => team.id !== formData.team_a)
            .map((team) => (
              <option key={team.id} value={team.id}>
                {team.name} - {team.category}
              </option>
            ))}
        </select>
      </div>
    </div>
  )
}