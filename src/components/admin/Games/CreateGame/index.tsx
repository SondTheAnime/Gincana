import { useState, useEffect } from 'react'
import { X, Users, Trophy, Settings } from 'lucide-react'
import { supabase } from '../../../../lib/supabase'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { CreateGameProps, GameFormData, Team, Player } from './types'
import { defaultConfigs } from './config'
import { GameBasicInfo } from './components/GameBasicInfo'
import { GameTeams } from './components/GameTeams'
import { GameSettings } from './components/GameSettings'

const CreateGame = ({ isOpen, onClose, onSuccess }: CreateGameProps) => {
  const [formData, setFormData] = useState<GameFormData>({
    sport: '',
    category: '',
    team_a: 0,
    team_b: 0,
    player_a: undefined,
    player_b: undefined,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    location: '',
    config: defaultConfigs['Vôlei']
  })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const isIndividual = formData.sport === 'Tênis de Mesa'
      
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .insert([
          {
            sport: formData.sport,
            category: formData.category,
            team_a: isIndividual ? null : formData.team_a,
            team_b: isIndividual ? null : formData.team_b,
            player_a: isIndividual ? formData.player_a : null,
            player_b: isIndividual ? formData.player_b : null,
            date: formData.date,
            time: formData.time,
            location: formData.location,
            status: 'scheduled',
            score_a: 0,
            score_b: 0,
            team_a_name: isIndividual 
              ? players.find(p => p.id === formData.player_a)?.name || ''
              : teams.find(t => t.id === formData.team_a)?.name || '',
            team_b_name: isIndividual
              ? players.find(p => p.id === formData.player_b)?.name || ''
              : teams.find(t => t.id === formData.team_b)?.name || ''
          }
        ])
        .select()
        .single()

      if (gameError) throw gameError

      // Verificar se já existe configuração para este jogo
      const { data: existingConfig } = await supabase
        .from('game_configs')
        .select('*')
        .eq('game_id', gameData.id)
        .single()

      // Criar configuração apenas se não existir
      if (!existingConfig) {
        const { error: configError } = await supabase
          .from('game_configs')
          .insert([{
            game_id: gameData.id,
            total_sets: formData.config.total_sets,
            points_per_set: formData.config.points_per_set,
            points_last_set: formData.config.points_last_set,
            min_difference: formData.config.min_difference,
            max_timeouts: formData.config.max_timeouts,
            max_substitutions: formData.config.max_substitutions
          }])

        if (configError) throw configError
      }

      toast.success('Jogo criado com sucesso!')
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Erro ao criar jogo:', error)
      toast.error('Erro ao criar jogo')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Criar Novo Jogo
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-between mb-6">
            <div className="flex space-x-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex items-center ${s === step ? 'text-red-500' : 'text-gray-400'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                    ${s === step ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'}`}
                  >
                    {s === 1 && <Trophy className="h-4 w-4" />}
                    {s === 2 && <Users className="h-4 w-4" />}
                    {s === 3 && <Settings className="h-4 w-4" />}
                  </div>
                  {s < 3 && <div className={`w-8 h-0.5 ${s < step ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`} />}
                </div>
              ))}
            </div>
          </div>

          <form className="space-y-6">
            {step === 1 && <GameBasicInfo formData={formData} setFormData={setFormData} />}
            {step === 2 && <GameTeams formData={formData} setFormData={setFormData} />}
            {step === 3 && <GameSettings formData={formData} setFormData={setFormData} />}

            <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-400"
                >
                  Voltar
                </button>
              ) : (
                <div></div>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && (!formData.sport || !formData.category || !formData.date || !formData.time || !formData.location)) ||
                    (step === 2 && formData.sport === 'Tênis de Mesa' && (!formData.player_a || !formData.player_b)) ||
                    (step === 2 && formData.sport !== 'Tênis de Mesa' && (!formData.team_a || !formData.team_b))
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Criando...' : 'Criar Jogo'}
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CreateGame