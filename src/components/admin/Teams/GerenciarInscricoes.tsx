import { useState, useEffect } from 'react'
import { Switch } from '@headlessui/react'
import { supabase } from '../../../lib/supabase'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

type InscricoesConfig = {
  inscricoes_times_abertas: boolean
  inscricoes_jogadores_abertas: boolean
}

const GerenciarInscricoes = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [config, setConfig] = useState<InscricoesConfig>({
    inscricoes_times_abertas: true,
    inscricoes_jogadores_abertas: true
  })

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('inscricoes_config')
        .select('*')
        .single()

      if (error) throw error

      if (data) {
        setConfig({
          inscricoes_times_abertas: data.inscricoes_times_abertas,
          inscricoes_jogadores_abertas: data.inscricoes_jogadores_abertas
        })
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error)
      toast.error('Erro ao carregar configurações')
    } finally {
      setIsLoading(false)
    }
  }

  const updateConfig = async (newConfig: Partial<InscricoesConfig>) => {
    try {
      setIsSaving(true)
      const updatedConfig = { ...config, ...newConfig }

      const { error } = await supabase
        .from('inscricoes_config')
        .update(updatedConfig)
        .eq('id', 1) // Assumindo que temos apenas uma linha de configuração

      if (error) throw error

      setConfig(updatedConfig)
      toast.success('Configurações atualizadas com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
      toast.error('Erro ao atualizar configurações')
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleAll = async (enabled: boolean) => {
    await updateConfig({
      inscricoes_times_abertas: enabled,
      inscricoes_jogadores_abertas: enabled
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Gerenciar Inscrições
      </h2>

      <div className="space-y-8">
        {/* Controle geral */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Todas as Inscrições
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ativar ou desativar todas as inscrições de uma vez
              </p>
            </div>
            <Switch
              checked={config.inscricoes_times_abertas && config.inscricoes_jogadores_abertas}
              onChange={handleToggleAll}
              disabled={isSaving}
              className={`
                ${
                  config.inscricoes_times_abertas && config.inscricoes_jogadores_abertas
                    ? 'bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }
                relative inline-flex h-6 w-11 items-center rounded-full
                transition-colors focus:outline-none focus:ring-2
                focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <span
                className={`
                  ${
                    config.inscricoes_times_abertas && config.inscricoes_jogadores_abertas
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }
                  inline-block h-4 w-4 transform rounded-full
                  bg-white transition-transform
                `}
              />
            </Switch>
          </div>
        </div>

        {/* Controles individuais */}
        <div className="space-y-6">
          {/* Inscrições de Times */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Inscrições de Times
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Permitir que técnicos inscrevam novos times
              </p>
            </div>
            <Switch
              checked={config.inscricoes_times_abertas}
              onChange={(checked) => updateConfig({ inscricoes_times_abertas: checked })}
              disabled={isSaving}
              className={`
                ${
                  config.inscricoes_times_abertas
                    ? 'bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }
                relative inline-flex h-6 w-11 items-center rounded-full
                transition-colors focus:outline-none focus:ring-2
                focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <span
                className={`
                  ${config.inscricoes_times_abertas ? 'translate-x-6' : 'translate-x-1'}
                  inline-block h-4 w-4 transform rounded-full
                  bg-white transition-transform
                `}
              />
            </Switch>
          </div>

          {/* Inscrições de Jogadores */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Inscrições de Jogadores
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Permitir que jogadores se inscrevam em times existentes
              </p>
            </div>
            <Switch
              checked={config.inscricoes_jogadores_abertas}
              onChange={(checked) => updateConfig({ inscricoes_jogadores_abertas: checked })}
              disabled={isSaving}
              className={`
                ${
                  config.inscricoes_jogadores_abertas
                    ? 'bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }
                relative inline-flex h-6 w-11 items-center rounded-full
                transition-colors focus:outline-none focus:ring-2
                focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <span
                className={`
                  ${config.inscricoes_jogadores_abertas ? 'translate-x-6' : 'translate-x-1'}
                  inline-block h-4 w-4 transform rounded-full
                  bg-white transition-transform
                `}
              />
            </Switch>
          </div>
        </div>

        {/* Status atual */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Status Atual
          </h4>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Times: </span>
              <span className={`font-medium ${config.inscricoes_times_abertas ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {config.inscricoes_times_abertas ? 'Abertas' : 'Fechadas'}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Jogadores: </span>
              <span className={`font-medium ${config.inscricoes_jogadores_abertas ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {config.inscricoes_jogadores_abertas ? 'Abertas' : 'Fechadas'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GerenciarInscricoes 