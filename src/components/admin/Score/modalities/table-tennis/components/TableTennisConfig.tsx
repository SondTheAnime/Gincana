import { useState } from 'react'
import { Settings } from 'lucide-react'
import { supabase } from '../../../../../../lib/supabase'
import { toast } from 'sonner'
import { TableTennisGame } from '../types'

interface TableTennisConfigProps {
  game: TableTennisGame
  onUpdateGame: (game: TableTennisGame) => void
}

export const TableTennisConfig = ({ game, onUpdateGame }: TableTennisConfigProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState({
    total_sets: game.config.total_sets,
    points_per_set: game.config.points_per_set,
    min_difference: game.config.min_difference,
    max_timeouts: game.config.max_timeouts
  })

  const handleSave = async () => {
    try {
      setLoading(true)

      const { error } = await supabase
        .from('game_configs')
        .update({
          total_sets: config.total_sets,
          points_per_set: config.points_per_set,
          min_difference: config.min_difference,
          max_timeouts: config.max_timeouts
        })
        .eq('game_id', game.id)

      if (error) throw error

      onUpdateGame({
        ...game,
        config: {
          ...game.config,
          ...config
        }
      })

      setIsOpen(false)
      toast.success('Configurações atualizadas com sucesso')
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
      toast.error('Erro ao atualizar configurações')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
      >
        <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Configurações do Jogo
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total de Sets
                </label>
                <input
                  type="number"
                  value={config.total_sets}
                  onChange={(e) => setConfig({ ...config, total_sets: Number(e.target.value) })}
                  min={1}
                  max={9}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pontos por Set
                </label>
                <input
                  type="number"
                  value={config.points_per_set}
                  onChange={(e) => setConfig({ ...config, points_per_set: Number(e.target.value) })}
                  min={1}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Diferença Mínima
                </label>
                <input
                  type="number"
                  value={config.min_difference}
                  onChange={(e) => setConfig({ ...config, min_difference: Number(e.target.value) })}
                  min={1}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Timeouts por Set
                </label>
                <input
                  type="number"
                  value={config.max_timeouts}
                  onChange={(e) => setConfig({ ...config, max_timeouts: Number(e.target.value) })}
                  min={0}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TableTennisConfig 