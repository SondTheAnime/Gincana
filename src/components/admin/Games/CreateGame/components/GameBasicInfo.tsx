import { Calendar, Clock, MapPin } from 'lucide-react'
import { StepProps } from '../types'
import { useEffect, useState } from 'react'
import { supabase } from '../../../../../lib/supabase'
import { toast } from 'sonner'

export const GameBasicInfo = ({ formData, setFormData }: StepProps) => {
  const [sports, setSports] = useState<string[]>([])

  useEffect(() => {
    fetchSports()
  }, [])

  const fetchSports = async () => {
    try {
      const { data, error } = await supabase
        .from('modalities')
        .select('name')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setSports(data.map(sport => sport.name))
    } catch (error) {
      console.error('Erro ao buscar modalidades:', error)
      toast.error('Erro ao carregar modalidades')
    }
  }

  return (
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
  )
}