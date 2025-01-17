import { useState, useEffect } from 'react'
import { X, Calendar, Clock, MapPin, Users, Trophy, Settings } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

interface CreateGameProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface Team {
  id: number
  name: string
  modality: string
  category: string
}

interface GameFormData {
  sport: string
  category: string
  team_a: number
  team_b: number
  date: string
  time: string
  location: string
  config: {
    total_sets: number
    points_per_set: number
    points_last_set?: number
    min_difference: number
    max_timeouts?: number
    max_substitutions?: number
  }
}

const defaultConfigs = {
  'Vôlei': {
    total_sets: 3, // Alterado o valor padrão para 3
    points_per_set: 25,
    points_last_set: 15,
    min_difference: 2,
    max_timeouts: 2,
    max_substitutions: 6
  },
  'Tênis de Mesa': {
    total_sets: 7,
    points_per_set: 11,
    min_difference: 2,
    max_timeouts: 1
  }
}

const CreateGame = ({ isOpen, onClose, onSuccess }: CreateGameProps) => {
  const [formData, setFormData] = useState<GameFormData>({
    sport: '',
    category: '',
    team_a: 0,
    team_b: 0,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    location: '',
    config: defaultConfigs['Vôlei']
  })

  const [sports, setSports] = useState<string[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => {
    fetchSports()
    fetchTeams()
  }, [])

  useEffect(() => {
    if (formData.sport) {
      setFormData(prev => ({
        ...prev,
        config: defaultConfigs[formData.sport as keyof typeof defaultConfigs] || defaultConfigs['Vôlei']
      }))
    }
  }, [formData.sport])

  const fetchSports = async () => {
    try {
      const { data, error } = await supabase
        .from('modalities')
        .select('name')
        .eq('is_team_sport', true)
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setSports(data.map(sport => sport.name))
    } catch (error) {
      console.error('Erro ao buscar modalidades:', error)
      toast.error('Erro ao carregar modalidades')
    }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .insert([
          {
            sport: formData.sport,
            category: formData.category,
            team_a: formData.team_a,
            team_b: formData.team_b,
            date: formData.date,
            time: formData.time,
            location: formData.location,
            status: 'scheduled',
            score_a: 0,
            score_b: 0,
            team_a_name: teams.find(t => t.id === formData.team_a)?.name || '',
            team_b_name: teams.find(t => t.id === formData.team_b)?.name || ''
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

  const filteredTeams = teams.filter(team => team.modality === formData.sport)

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
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Modalidade
                  </label>
                  <select
                    value={formData.sport}
                    onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                    required
                  >
                    <option value="">Selecione uma modalidade</option>
                    {sports.map((sport) => (
                      <option key={sport} value={sport}>
                        {sport}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Misto">Misto</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Calendar className="h-4 w-4 inline-block mr-1" />
                      Data
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Clock className="h-4 w-4 inline-block mr-1" />
                      Horário
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <MapPin className="h-4 w-4 inline-block mr-1" />
                    Local
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Ginásio Principal"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                    required
                  />
                </div>
              </div>
            )}

            {step === 2 && (
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
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total de Sets
                  </label>
                  <select
                    value={formData.config.total_sets}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setFormData({
                        ...formData,
                        config: {
                          ...formData.config,
                          total_sets: value,
                          // Ajusta pontos do último set automaticamente para jogos de 3 sets
                          points_last_set: value === 3 ? 25 : 15
                        }
                      });
                    }}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                    required
                  >
                    {formData.sport === 'Vôlei' ? (
                      <>
                        <option value="3">3 Sets</option>
                      </>
                    ) : (
                      <>
                        <option value={5}>5 Sets</option>
                        <option value={7}>7 Sets</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pontos por Set
                  </label>
                  <input
                    type="number"
                    value={formData.config.points_per_set}
                    onChange={(e) => setFormData({
                      ...formData,
                      config: { ...formData.config, points_per_set: Number(e.target.value) }
                    })}
                    min={formData.sport === 'Vôlei' ? 15 : 11}
                    max={formData.sport === 'Vôlei' ? 25 : 21}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                    required
                  />
                </div>

                {formData.sport === 'Vôlei' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Pontos no Último Set
                      </label>
                      <input
                        type="number"
                        value={formData.config.points_last_set}
                        onChange={(e) => setFormData({
                          ...formData,
                          config: { ...formData.config, points_last_set: Number(e.target.value) }
                        })}
                        min={15}
                        max={25}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Timeouts por Set
                      </label>
                      <input
                        type="number"
                        value={formData.config.max_timeouts}
                        onChange={(e) => setFormData({
                          ...formData,
                          config: { ...formData.config, max_timeouts: Number(e.target.value) }
                        })}
                        min={0}
                        max={2}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Substituições por Set
                      </label>
                      <input
                        type="number"
                        value={formData.config.max_substitutions}
                        onChange={(e) => setFormData({
                          ...formData,
                          config: { ...formData.config, max_substitutions: Number(e.target.value) }
                        })}
                        min={0}
                        max={6}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                        required
                      />
                    </div>
                  </>
                )}

                {formData.sport === 'Tênis de Mesa' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Timeouts por Jogo
                    </label>
                    <input
                      type="number"
                      value={formData.config.max_timeouts}
                      onChange={(e) => setFormData({
                        ...formData,
                        config: { ...formData.config, max_timeouts: Number(e.target.value) }
                      })}
                      min={0}
                      max={1}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Diferença Mínima de Pontos
                  </label>
                  <input
                    type="number"
                    value={formData.config.min_difference}
                    onChange={(e) => setFormData({
                      ...formData,
                      config: { ...formData.config, min_difference: Number(e.target.value) }
                    })}
                    min={1}
                    max={5}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                    required
                  />
                </div>
              </div>
            )}

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
                    (step === 2 && (!formData.team_a || !formData.team_b))
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