import { useState } from 'react'
import { supabase } from '../../../../../../lib/supabase'
import { toast } from 'react-toastify'
import { VolleyballGame } from '../types'
import { Settings } from 'lucide-react'

interface VolleyballConfigProps {
  game: VolleyballGame
  onUpdateGame: (game: VolleyballGame) => void
}

const VolleyballConfig = ({ game, onUpdateGame }: VolleyballConfigProps) => {
  const [showConfig, setShowConfig] = useState(false)
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState({
    total_sets: game.config.total_sets,
    points_per_set: game.config.points_per_set,
    points_last_set: game.config.points_last_set,
    min_difference: game.config.min_difference,
    max_timeouts: game.config.max_timeouts,
    max_substitutions: game.config.max_substitutions
  })

  const handleSaveConfig = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.rpc('update_game_config', {
        p_game_id: game.id,
        p_total_sets: config.total_sets,
        p_points_per_set: config.points_per_set,
        p_points_last_set: config.points_last_set,
        p_min_difference: config.min_difference,
        p_max_timeouts: config.max_timeouts,
        p_max_substitutions: config.max_substitutions
      })

      if (error) throw error

      onUpdateGame({
        ...game,
        config: {
          ...game.config,
          ...config
        }
      })

      setShowConfig(false)
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
        onClick={() => setShowConfig(true)}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
      >
        <Settings size={16} />
        Configurações
      </button>

      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Configurações do Jogo</h4>
              <button
                onClick={() => setShowConfig(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Total de Sets</label>
                <select
                  value={config.total_sets}
                  onChange={(e) => setConfig({ ...config, total_sets: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2"
                >
                  <option value={3}>3 Sets</option>
                  <option value={5}>5 Sets</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Pontos por Set</label>
                <input
                  type="number"
                  value={config.points_per_set}
                  onChange={(e) => setConfig({ ...config, points_per_set: Number(e.target.value) })}
                  min={15}
                  max={25}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Pontos no Último Set</label>
                <input
                  type="number"
                  value={config.points_last_set}
                  onChange={(e) => setConfig({ ...config, points_last_set: Number(e.target.value) })}
                  min={15}
                  max={25}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Diferença Mínima</label>
                <input
                  type="number"
                  value={config.min_difference}
                  onChange={(e) => setConfig({ ...config, min_difference: Number(e.target.value) })}
                  min={1}
                  max={3}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Timeouts por Set</label>
                <input
                  type="number"
                  value={config.max_timeouts}
                  onChange={(e) => setConfig({ ...config, max_timeouts: Number(e.target.value) })}
                  min={0}
                  max={2}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Substituições por Set</label>
                <input
                  type="number"
                  value={config.max_substitutions}
                  onChange={(e) => setConfig({ ...config, max_substitutions: Number(e.target.value) })}
                  min={0}
                  max={6}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2"
                />
              </div>

              <button
                onClick={handleSaveConfig}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default VolleyballConfig 