import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Edit2, MapPin, Play, Trash2 } from 'lucide-react'
import { Match } from '../types'

interface GameCardProps {
  match: Match
  onEdit: (match: Match) => void
  onStart: (match: Match) => void
  onDelete: (match: Match) => void
}

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  live: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  finished: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
}

const statusLabels = {
  scheduled: 'Agendado',
  live: 'Em andamento',
  finished: 'Finalizado',
  cancelled: 'Cancelado',
}

export function GameCard({ match, onEdit, onStart, onDelete }: GameCardProps) {
  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este jogo?')) {
      onDelete(match)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[match.status]}`}>
            {statusLabels[match.status]}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {format(new Date(`${match.date}T${match.time}`), 'HH:mm', { locale: ptBR })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {match.status === 'scheduled' && (
            <button
              onClick={() => onStart(match)}
              className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-full transition-colors"
              title="Iniciar partida"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={() => onEdit(match)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-full transition-colors"
            title="Editar partida"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-full transition-colors"
            title="Excluir partida"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{match.team_a_name}</h3>
            {match.status !== 'scheduled' && (
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{match.score_a || 0}</span>
            )}
          </div>

          <span className="text-sm font-medium px-3 text-gray-500 dark:text-gray-400">VS</span>

          <div className="flex-1 text-right">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{match.team_b_name}</h3>
            {match.status !== 'scheduled' && (
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{match.score_b || 0}</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{match.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <span>{match.sport}</span>
            <span>•</span>
            <span>{match.category}</span>
          </div>
        </div>

        {match.status === 'live' && match.game_time && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">Tempo de Jogo</span>
              <span className="text-gray-900 dark:text-gray-100">{match.game_time}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 