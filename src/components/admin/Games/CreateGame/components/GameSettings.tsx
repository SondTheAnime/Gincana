import { StepProps } from '../types'

export const GameSettings = ({ formData, setFormData }: StepProps) => {
  const isVolei = formData.sport === 'Vôlei'

  const updateConfig = (key: string, value: number) => {
    setFormData({
      ...formData,
      config: {
        ...formData.config,
        [key]: value,
        // Ajusta pontos do último set automaticamente para jogos de 3 sets no vôlei
        ...(key === 'total_sets' && isVolei && value === 3
          ? { points_last_set: 25 }
          : key === 'total_sets' && isVolei
          ? { points_last_set: 15 }
          : {})
      }
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Total de Sets
        </label>
        <select
          value={formData.config.total_sets}
          onChange={(e) => updateConfig('total_sets', Number(e.target.value))}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
          required
        >
          {isVolei ? (
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
          onChange={(e) => updateConfig('points_per_set', Number(e.target.value))}
          min={isVolei ? 15 : 11}
          max={isVolei ? 25 : 21}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
          required
        />
      </div>

      {isVolei && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pontos no Último Set
            </label>
            <input
              type="number"
              value={formData.config.points_last_set}
              onChange={(e) => updateConfig('points_last_set', Number(e.target.value))}
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
              onChange={(e) => updateConfig('max_timeouts', Number(e.target.value))}
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
              onChange={(e) => updateConfig('max_substitutions', Number(e.target.value))}
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
            onChange={(e) => updateConfig('max_timeouts', Number(e.target.value))}
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
          onChange={(e) => updateConfig('min_difference', Number(e.target.value))}
          min={1}
          max={5}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
          required
        />
      </div>
    </div>
  )
}