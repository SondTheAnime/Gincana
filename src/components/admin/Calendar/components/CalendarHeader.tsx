import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import * as Popover from '@radix-ui/react-popover'

interface CalendarHeaderProps {
  selectedMonth: string
  onMonthChange: (month: string) => void
  onFilterChange: (filters: CalendarFilters) => void
}

export interface CalendarFilters {
  sport?: string
  category?: string
  location?: string
  status?: string
}

export function CalendarHeader({ selectedMonth, onMonthChange, onFilterChange }: CalendarHeaderProps) {
  const [filters, setFilters] = useState<CalendarFilters>({})
  const [date, setDate] = useState(() => {
    const [year, month] = selectedMonth.split('-')
    return new Date(parseInt(year), parseInt(month) - 1)
  })

  const handlePreviousMonth = () => {
    const newDate = new Date(date.getFullYear(), date.getMonth() - 1)
    setDate(newDate)
    onMonthChange(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`)
  }

  const handleNextMonth = () => {
    const newDate = new Date(date.getFullYear(), date.getMonth() + 1)
    setDate(newDate)
    onMonthChange(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`)
  }

  const handleFilterChange = (key: keyof CalendarFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm mb-6 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {format(date, 'MMMM yyyy', { locale: ptBR })}
          </span>

          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-400"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg min-w-[240px] border border-gray-200 dark:border-gray-800">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Modalidade
                </label>
                <select
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  value={filters.sport}
                  onChange={(e) => handleFilterChange('sport', e.target.value)}
                >
                  <option value="">Todas</option>
                  <option value="Tênis de Mesa">Tênis de Mesa</option>
                  <option value="Vôlei">Vôlei</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoria
                </label>
                <select
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">Todas</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Misto">Misto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Local
                </label>
                <select
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="Quadra Principal">Quadra Principal</option>
                  <option value="Quadra Coberta">Quadra Coberta</option>
                  <option value="Campo">Campo</option>
                  <option value="Ginásio">Ginásio</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="scheduled">Agendado</option>
                  <option value="live">Em andamento</option>
                  <option value="finished">Finalizado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            </div>

            <Popover.Arrow className="fill-white dark:fill-gray-900" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </header>
  )
} 