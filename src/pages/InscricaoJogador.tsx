import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, Check, Lock } from 'lucide-react'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

type Team = {
  id: string
  name: string
  modality: string
  category: string
  turma: string
}

const formSchema = z.object({
  nomeJogador: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  turma: z.string().refine(val => ['Informática 2023', 'Automação 2023'].includes(val), 'Turma inválida'),
  modalidade: z.string().refine(val => ['Tênis de Mesa', 'Vôlei'].includes(val), 'Modalidade inválida'),
  teamId: z.string().min(1, 'Selecione um time'),
  genero: z.string().refine(val => ['Masculino', 'Feminino'].includes(val), 'Gênero inválido'),
  numeroCamisa: z.string().min(1, 'Número da camisa é obrigatório'),
  posicao: z.string().optional(),
  empunhadura: z.string().refine(val => !val || ['Clássica', 'Caneta', 'Híbrido'].includes(val), 'Empunhadura inválida'),
  estiloJogo: z.string().refine(val => !val || ['Ofensivo', 'Defensivo', 'All-Around'].includes(val), 'Estilo de jogo inválido'),
  lateralidade: z.string().refine(val => !val || ['Destro', 'Canhoto', 'Ambidestro'].includes(val), 'Lateralidade inválida'),
  telefone: z.string().min(10, 'Telefone inválido'),
})

type FormData = z.infer<typeof formSchema>

const InscricaoJogador = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [inscricoesAbertas, setInscricoesAbertas] = useState(true)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [teams, setTeams] = useState<Team[]>([])
  const [formData, setFormData] = useState<FormData>({
    nomeJogador: '',
    turma: '',
    modalidade: '',
    teamId: '',
    genero: 'Masculino',
    numeroCamisa: '',
    posicao: '',
    empunhadura: '',
    estiloJogo: '',
    lateralidade: '',
    telefone: '',
  })
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    checkInscricoesStatus()
  }, [])

  const checkInscricoesStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('inscricoes_config')
        .select('inscricoes_jogadores_abertas')
        .single()

      if (error) throw error

      if (data) {
        setInscricoesAbertas(data.inscricoes_jogadores_abertas)
      }
    } catch (error) {
      console.error('Erro ao verificar status das inscrições:', error)
      toast.error('Erro ao verificar status das inscrições')
    }
  }

  // Buscar times quando a modalidade, turma ou gênero mudar
  useEffect(() => {
    const fetchTeams = async () => {
      if (!formData.modalidade || !formData.turma || !formData.genero) {
        setTeams([])
        return
      }

      try {
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .eq('modality', formData.modalidade)
          .eq('turma', formData.turma)
          .or(`category.eq.${formData.genero},category.eq.Misto`)

        if (error) throw error

        setTeams(data)
      } catch (error) {
        console.error('Erro ao buscar times:', error)
        toast.error('Erro ao carregar times disponíveis')
      }
    }

    fetchTeams()
  }, [formData.modalidade, formData.turma, formData.genero])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      // Validar dados básicos
      formSchema.parse(formData)

      // Validar campos específicos da modalidade
      if (formData.modalidade === 'Vôlei' && !formData.posicao) {
        throw new Error('Selecione uma posição válida')
      }

      if (formData.modalidade === 'Tênis de Mesa') {
        if (!formData.empunhadura) throw new Error('Selecione uma empunhadura válida')
        if (!formData.estiloJogo) throw new Error('Selecione um estilo de jogo válido')
        if (!formData.lateralidade) throw new Error('Selecione uma lateralidade válida')
      }
      
      // Preparar dados para inserção
      const requestData = {
        nome_jogador: formData.nomeJogador.trim(),
        turma: formData.turma,
        modalidade: formData.modalidade,
        team_id: parseInt(formData.teamId),
        genero: formData.genero,
        numero_camisa: formData.numeroCamisa.toString(),
        posicao: formData.modalidade === 'Vôlei' ? formData.posicao : null,
        empunhadura: formData.modalidade === 'Tênis de Mesa' ? formData.empunhadura : null,
        estilo_jogo: formData.modalidade === 'Tênis de Mesa' ? formData.estiloJogo : null,
        lateralidade: formData.modalidade === 'Tênis de Mesa' ? formData.lateralidade : null,
        telefone: formData.telefone.replace(/\D/g, ''), // Remove caracteres não numéricos
        status: 'pendente'
      }

      // Validar campos obrigatórios
      if (!requestData.nome_jogador || !requestData.turma || !requestData.modalidade || 
          !requestData.team_id || !requestData.genero || !requestData.numero_camisa || 
          !requestData.telefone) {
        throw new Error('Todos os campos obrigatórios devem ser preenchidos')
      }

      // Enviar solicitação para o banco
      const { error } = await supabase
        .from('player_requests')
        .insert([requestData])

      if (error) throw error

      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setFormData({
          nomeJogador: '',
          turma: '',
          modalidade: '',
          teamId: '',
          genero: 'Masculino',
          numeroCamisa: '',
          posicao: '',
          empunhadura: '',
          estiloJogo: '',
          lateralidade: '',
          telefone: '',
        })
      }, 2000)

      toast.success('Solicitação enviada com sucesso!')
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            formattedErrors[err.path[0]] = err.message
          }
        })
        setErrors(formattedErrors)
      } else if (error instanceof Error) {
        // Tratar erros específicos da modalidade
        const errorMessage = error.message
        if (errorMessage.includes('posição')) {
          setErrors(prev => ({ ...prev, posicao: errorMessage }))
        } else if (errorMessage.includes('empunhadura')) {
          setErrors(prev => ({ ...prev, empunhadura: errorMessage }))
        } else if (errorMessage.includes('estilo de jogo')) {
          setErrors(prev => ({ ...prev, estiloJogo: errorMessage }))
        } else if (errorMessage.includes('lateralidade')) {
          setErrors(prev => ({ ...prev, lateralidade: errorMessage }))
        } else {
          console.error('Erro ao enviar solicitação:', error)
          toast.error('Erro ao enviar solicitação')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      // Se a modalidade, turma ou gênero mudar, resetar o time selecionado
      if (name === 'modalidade' || name === 'turma' || name === 'genero') {
        return { ...prev, [name]: value, teamId: '' }
      }
      return { ...prev, [name]: value }
    })
  }

  if (!inscricoesAbertas) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/inscricao')}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-8"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                <Lock className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Inscrições Fechadas
              </h1>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                As inscrições de jogadores estão temporariamente fechadas. Por favor, tente novamente mais tarde.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-green-100 dark:bg-green-900 p-6 rounded-full"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 0.5,
                  times: [0, 0.5, 1]
                }}
              >
                <Check className="w-16 h-16 text-green-600 dark:text-green-400" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/inscricao')}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-8"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Inscrição de Jogador
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Nome do Jogador
                </label>
                <input
                  type="text"
                  name="nomeJogador"
                  value={formData.nomeJogador}
                  onChange={handleInputChange}
                  className={`
                    w-full px-4 py-2 rounded-lg border
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                    ${errors.nomeJogador ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
                {errors.nomeJogador && (
                  <p className="mt-1 text-sm text-red-500">{errors.nomeJogador}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Turma
                </label>
                <select
                  name="turma"
                  value={formData.turma}
                  onChange={handleInputChange}
                  className={`
                    w-full px-4 py-2 rounded-lg border
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                    ${errors.turma ? 'border-red-500' : 'border-gray-300'}
                  `}
                >
                  <option value="">Selecione a turma</option>
                  <option value="Informática 2023">Informática 2023</option>
                  <option value="Automação 2023">Automação 2023</option>
                </select>
                {errors.turma && (
                  <p className="mt-1 text-sm text-red-500">{errors.turma}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Modalidade
                </label>
                <select
                  name="modalidade"
                  value={formData.modalidade}
                  onChange={handleInputChange}
                  className={`
                    w-full px-4 py-2 rounded-lg border
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                    ${errors.modalidade ? 'border-red-500' : 'border-gray-300'}
                  `}
                >
                  <option value="">Selecione a modalidade</option>
                  <option value="Tênis de Mesa">Tênis de Mesa</option>
                  <option value="Vôlei">Vôlei</option>
                </select>
                {errors.modalidade && (
                  <p className="mt-1 text-sm text-red-500">{errors.modalidade}</p>
                )}
              </div>

              {formData.modalidade && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Time
                  </label>
                  <select
                    name="teamId"
                    value={formData.teamId}
                    onChange={handleInputChange}
                    className={`
                      w-full px-4 py-2 rounded-lg border
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      dark:bg-gray-700 dark:border-gray-600 dark:text-white
                      ${errors.teamId ? 'border-red-500' : 'border-gray-300'}
                    `}
                  >
                    <option value="">Selecione o time</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  {errors.teamId && (
                    <p className="mt-1 text-sm text-red-500">{errors.teamId}</p>
                  )}
                  {teams.length === 0 && (
                    <p className="mt-1 text-sm text-yellow-500">
                      Nenhum time disponível para esta modalidade
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Gênero
                </label>
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={handleInputChange}
                  className={`
                    w-full px-4 py-2 rounded-lg border
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                    ${errors.genero ? 'border-red-500' : 'border-gray-300'}
                  `}
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
                {errors.genero && (
                  <p className="mt-1 text-sm text-red-500">{errors.genero}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Número da Camisa
                </label>
                <input
                  type="number"
                  name="numeroCamisa"
                  value={formData.numeroCamisa}
                  onChange={handleInputChange}
                  min="0"
                  max="99"
                  className={`
                    w-full px-4 py-2 rounded-lg border
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                    ${errors.numeroCamisa ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
                {errors.numeroCamisa && (
                  <p className="mt-1 text-sm text-red-500">{errors.numeroCamisa}</p>
                )}
              </div>

              {formData.modalidade === 'Vôlei' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Posição
                  </label>
                  <select
                    name="posicao"
                    value={formData.posicao}
                    onChange={handleInputChange}
                    className={`
                      w-full px-4 py-2 rounded-lg border
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      dark:bg-gray-700 dark:border-gray-600 dark:text-white
                      ${errors.posicao ? 'border-red-500' : 'border-gray-300'}
                    `}
                  >
                    <option value="">Selecione a posição</option>
                    <option value="Levantador">Levantador</option>
                    <option value="Ponteiro">Ponteiro</option>
                    <option value="Oposto">Oposto</option>
                    <option value="Central">Central</option>
                    <option value="Líbero">Líbero</option>
                  </select>
                  {errors.posicao && (
                    <p className="mt-1 text-sm text-red-500">{errors.posicao}</p>
                  )}
                </div>
              )}

              {formData.modalidade === 'Tênis de Mesa' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Empunhadura
                    </label>
                    <select
                      name="empunhadura"
                      value={formData.empunhadura}
                      onChange={handleInputChange}
                      className={`
                        w-full px-4 py-2 rounded-lg border
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white
                        ${errors.empunhadura ? 'border-red-500' : 'border-gray-300'}
                      `}
                    >
                      <option value="">Selecione a empunhadura</option>
                      <option value="Clássica">Clássica</option>
                      <option value="Caneta">Caneta</option>
                      <option value="Híbrido">Híbrido</option>  
                    </select>
                    {errors.empunhadura && (
                      <p className="mt-1 text-sm text-red-500">{errors.empunhadura}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Estilo de Jogo
                    </label>
                    <select
                      name="estiloJogo"
                      value={formData.estiloJogo}
                      onChange={handleInputChange}
                      className={`
                        w-full px-4 py-2 rounded-lg border
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white
                        ${errors.estiloJogo ? 'border-red-500' : 'border-gray-300'}
                      `}
                    >
                      <option value="">Selecione o estilo</option>
                      <option value="Ofensivo">Ofensivo</option>
                      <option value="Defensivo">Defensivo</option>
                      <option value="All-Around">All-Around</option>
                    </select>
                    {errors.estiloJogo && (
                      <p className="mt-1 text-sm text-red-500">{errors.estiloJogo}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Lateralidade
                    </label>
                    <select
                      name="lateralidade"
                      value={formData.lateralidade}
                      onChange={handleInputChange}
                      className={`
                        w-full px-4 py-2 rounded-lg border
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white
                        ${errors.lateralidade ? 'border-red-500' : 'border-gray-300'}
                      `}
                    >
                      <option value="">Selecione a lateralidade</option>
                      <option value="Destro">Destro</option>
                      <option value="Canhoto">Canhoto</option>
                      <option value="Ambidestro">Ambidestro</option>
                    </select>
                    {errors.lateralidade && (
                      <p className="mt-1 text-sm text-red-500">{errors.lateralidade}</p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Telefone para Contato
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                  className={`
                    w-full px-4 py-2 rounded-lg border
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                    ${errors.telefone ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
                {errors.telefone && (
                  <p className="mt-1 text-sm text-red-500">{errors.telefone}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full flex items-center justify-center
                  px-4 py-3 rounded-lg text-white
                  bg-blue-600 hover:bg-blue-700
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  transition-colors
                  ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
                `}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Inscrição'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InscricaoJogador 