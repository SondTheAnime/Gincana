import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, Check } from 'lucide-react'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

const formSchema = z.object({
  nomeTecnico: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  auxiliarTecnico: z.string().optional(),
  turma: z.string().refine(val => ['Informática 2023', 'Automação 2023'].includes(val), 'Turma inválida'),
  modalidade: z.string().refine(val => ['Tênis de Mesa', 'Vôlei'].includes(val), 'Modalidade inválida'),
  genero: z.string(),
  telefone: z.string().min(10, 'Telefone inválido'),
})

type FormData = z.infer<typeof formSchema>

const InscricaoTime = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [formData, setFormData] = useState<FormData>({
    nomeTecnico: '',
    auxiliarTecnico: '',
    turma: '',
    modalidade: '',
    genero: 'Masculino',
    telefone: '',
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      // Validar dados com Zod
      formSchema.parse(formData)

      // Validar gênero manualmente
      if (!['Masculino', 'Feminino', 'Misto'].includes(formData.genero)) {
        throw new Error('Gênero inválido')
      }
      
      // Enviar solicitação para o banco
      const { error } = await supabase
        .from('team_requests')
        .insert([
          {
            nome_tecnico: formData.nomeTecnico,
            auxiliar_tecnico: formData.auxiliarTecnico || null,
            turma: formData.turma,
            modalidade: formData.modalidade,
            genero: formData.genero,
            telefone: formData.telefone,
            status: 'pendente'
          }
        ])

      if (error) throw error

      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        // Limpar formulário
        setFormData({
          nomeTecnico: '',
          auxiliarTecnico: '',
          turma: '',
          modalidade: '',
          genero: 'Masculino',
          telefone: ''
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
        if (error.message === 'Gênero inválido') {
          setErrors(prev => ({ ...prev, genero: 'Selecione um gênero válido' }))
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
    setFormData(prev => ({ ...prev, [name]: value }) as FormData)
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
              Inscrição de Time
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Nome do Técnico
                </label>
                <input
                  type="text"
                  name="nomeTecnico"
                  value={formData.nomeTecnico}
                  onChange={handleInputChange}
                  className={`
                    w-full px-4 py-2 rounded-lg border
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                    ${errors.nomeTecnico ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
                {errors.nomeTecnico && (
                  <p className="mt-1 text-sm text-red-500">{errors.nomeTecnico}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Nome do Auxiliar Técnico (Opcional)
                </label>
                <input
                  type="text"
                  name="auxiliarTecnico"
                  value={formData.auxiliarTecnico}
                  onChange={handleInputChange}
                  className={`
                    w-full px-4 py-2 rounded-lg border
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                    ${errors.auxiliarTecnico ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
                {errors.auxiliarTecnico && (
                  <p className="mt-1 text-sm text-red-500">{errors.auxiliarTecnico}</p>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Gênero do Time
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
                  <option value="Misto">Misto</option>
                </select>
                {errors.genero && (
                  <p className="mt-1 text-sm text-red-500">{errors.genero}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Telefone para Contato
                </label>
                <div className="relative">
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
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Este número será usado apenas em caso de dúvidas pela organização.
                </p>
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

export default InscricaoTime 