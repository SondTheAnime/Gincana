import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { supabase } from '../../../../../lib/supabase'
import { toast } from 'sonner'
import { TableTennisGame } from './types'
import { TableTennisSets } from './components/TableTennisSets'
import { TableTennisPoints } from './components/TableTennisPoints'
import { TableTennisTimeouts } from './components/TableTennisTimeouts'
import { TableTennisHighlights } from './components/TableTennisHighlights'
import GameTimer from '../../GameTimer'
import TableTennisConfig from './components/TableTennisConfig'

interface TableTennisScoreProps {
  game: TableTennisGame
  onClose: () => void
  onUpdateGame: (game: TableTennisGame) => void
}

const TableTennisScore = ({ game, onClose, onUpdateGame }: TableTennisScoreProps) => {
  const [loading, setLoading] = useState(true)
  const [lastFetch, setLastFetch] = useState(0)

  const fetchGameDetails = useCallback(async () => {
    const now = Date.now()
    // Limitar requisições a uma a cada 2 segundos
    if (now - lastFetch < 2000) {
      return
    }

    setLastFetch(now)

    try {
      // Buscar detalhes do jogo de tênis de mesa
      let { data: details, error: detailsError } = await supabase
        .from('table_tennis_game_details')
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
          .from('table_tennis_game_details')
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
            total_sets: game.config?.total_sets || 5,
            points_per_set: game.config?.points_per_set || 11,
            min_difference: game.config?.min_difference || 2,
            max_timeouts: game.config?.max_timeouts || 1
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
  }, [game, onUpdateGame, lastFetch])

  useEffect(() => {
    fetchGameDetails()

    // Atualizar a cada 5 segundos se o jogo estiver em andamento
    let interval: NodeJS.Timeout
    if (game.status === 'live') {
      interval = setInterval(fetchGameDetails, 5000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [fetchGameDetails, game.status])

  const handleTimeUpdate = (time: string) => {
    onUpdateGame({ ...game, game_time: time })
  }

  const handlePeriodChange = async (period: 'not_started' | 'in_progress' | 'finished') => {
    try {
      setLoading(true)
      
      // Atualizar o status do jogo no banco de dados
      const { error } = await supabase
        .from('games')
        .update({
          period,
          status: period === 'finished' ? 'finished' : period === 'in_progress' ? 'live' : 'scheduled'
        })
        .eq('id', game.id)

      if (error) throw error

      // Atualizar o estado local
      onUpdateGame({ 
        ...game, 
        period,
        status: period === 'finished' ? 'finished' : period === 'in_progress' ? 'live' : 'scheduled'
      })

      toast.success(`Status do jogo alterado para: ${period}`)
    } catch (error) {
      console.error('Erro ao atualizar status do jogo:', error)
      toast.error('Erro ao atualizar status do jogo')
    } finally {
      setLoading(false)
    }
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
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl p-3 sm:p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
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
            <TableTennisConfig game={game} onUpdateGame={onUpdateGame} />
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

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
          <TableTennisPoints game={game} onUpdateGame={onUpdateGame} />

          {/* Timeouts */}
          <TableTennisTimeouts game={game} onUpdateGame={onUpdateGame} />

          {/* Sets */}
          <TableTennisSets game={game} onUpdateGame={onUpdateGame} />

          {/* Highlights */}
          <TableTennisHighlights game={game} onUpdateGame={onUpdateGame} />
        </div>
      </div>
    </motion.div>
  )
}

export default TableTennisScore 