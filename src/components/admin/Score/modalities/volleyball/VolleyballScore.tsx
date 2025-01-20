import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { supabase } from '../../../../../lib/supabase'
import { toast } from 'react-toastify'
import { VolleyballGame } from './types'
import VolleyballSets from './components/VolleyballSets'
import VolleyballTimeouts from './components/VolleyballTimeouts'
import VolleyballPoints from './components/VolleyballPoints'
import VolleyballHighlights from './components/VolleyballHighlights'
import VolleyballConfig from './components/VolleyballConfig'
import VolleyballStats from './components/VolleyballStats'
import GameTimer from '../../GameTimer'

interface VolleyballScoreProps {
  game: VolleyballGame
  onClose: () => void
  onUpdateGame: (game: VolleyballGame) => void
}

const VolleyballScore = ({ game, onClose, onUpdateGame }: VolleyballScoreProps) => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'game' | 'stats'>('game')

  useEffect(() => {
    async function fetchGameDetails() {
      try {
        // Buscar detalhes do jogo de vôlei
        let { data: details, error: detailsError } = await supabase
          .from('volleyball_game_details')
          .select('*')
          .eq('game_id', game.id)
          .single()

        if (detailsError) throw detailsError

        // Buscar configurações do jogo
        let { data: config, error: configError } = await supabase
          .from('game_configs')
          .select('*')
          .eq('game_id', game.id)
          .single()

        if (configError) throw configError

        // Buscar sets do jogo
        const { data: sets, error: setsError } = await supabase
          .from('game_sets')
          .select('*')
          .eq('game_id', game.id)
          .order('set_number')

        if (setsError) throw setsError

        // Buscar eventos do jogo
        const { data: events, error: eventsError } = await supabase
          .from('game_events')
          .select('*')
          .eq('game_id', game.id)
          .order('created_at', { ascending: false })

        if (eventsError) throw eventsError

        // Se não houver detalhes, criar
        if (!details) {
          const { data: newDetails, error: createDetailsError } = await supabase
            .from('volleyball_game_details')
            .insert([{
              game_id: game.id,
              current_set: 1,
              points_a: 0,
              points_b: 0,
              timeouts_a: 0,
              timeouts_b: 0
            }])
            .select()
            .single()

          if (createDetailsError) throw createDetailsError
          details = newDetails
        }

        // Se não houver configuração, criar
        if (!config) {
          const { data: newConfig, error: createConfigError } = await supabase
            .from('game_configs')
            .insert([{
              game_id: game.id,
              total_sets: 3,
              points_per_set: 25,
              points_last_set: 15,
              min_difference: 2,
              max_timeouts: 2,
              max_substitutions: 6
            }])
            .select()
            .single()

          if (createConfigError) throw createConfigError
          config = newConfig
        }

        onUpdateGame({
          ...game,
          details,
          config,
          sets: sets || [],
          highlights: events || []
        })
      } catch (error) {
        console.error('Erro ao carregar detalhes do jogo:', error)
        toast.error('Erro ao carregar detalhes do jogo. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchGameDetails()
  }, [game, onUpdateGame])

  const handleTimeUpdate = (time: string) => {
    onUpdateGame({ ...game, game_time: time })
  }

  const handlePeriodChange = (period: 'not_started' | 'in_progress' | 'finished') => {
    onUpdateGame({ ...game, period })
  }

  if (loading) {
    return (
      <motion.div
        layoutId={`game-${game.id}`}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4"
      >
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      layoutId={`game-${game.id}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl p-3 sm:p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {game.sport} - {game.category}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {game.team_a_name} vs {game.team_b_name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <VolleyballConfig game={game} onUpdateGame={onUpdateGame} />
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          <button
            onClick={() => setActiveTab('game')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'game'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Jogo
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'stats'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Estatísticas
          </button>
        </div>

        {activeTab === 'game' ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {/* Timer e Status do Jogo */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <GameTimer initialTime={game.game_time} onTimeUpdate={handleTimeUpdate} />
              
              <select
                value={game.period}
                onChange={(e) => handlePeriodChange(e.target.value as 'not_started' | 'in_progress' | 'finished')}
                className="w-full sm:w-auto text-sm sm:text-base rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3"
              >
                <option value="not_started">Não Iniciado</option>
                <option value="in_progress">Em Andamento</option>
                <option value="finished">Finalizado</option>
              </select>
            </div>

            {/* Placar do Set Atual */}
            <VolleyballPoints game={game} onUpdateGame={onUpdateGame} />

            {/* Timeouts */}
            <VolleyballTimeouts game={game} onUpdateGame={onUpdateGame} />

            {/* Sets */}
            <VolleyballSets game={game} onUpdateGame={onUpdateGame} />

            {/* Highlights */}
            <VolleyballHighlights game={game} onUpdateGame={onUpdateGame} />
          </div>
        ) : (
          <VolleyballStats game={game} />
        )}
      </div>
    </motion.div>
  )
}

export default VolleyballScore 