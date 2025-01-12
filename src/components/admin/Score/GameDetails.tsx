import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Game, GameEvent, Player } from './types'
import GameTimer from './GameTimer'
import GameEvents from './GameEvents'
import { X } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { toast } from 'react-toastify'

interface GameDetailsProps {
  game: Game
  onClose: () => void
  onUpdateGame: (game: Game) => void
}

const GameDetails = ({ game, onClose, onUpdateGame }: GameDetailsProps) => {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar jogadores dos times
        const { data: playersData, error: playersError } = await supabase
          .from('players')
          .select('*')
          .in('team_id', [game.team_a, game.team_b])
          .order('name')

        if (playersError) throw playersError

        setPlayers(playersData || [])
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        toast.error('Erro ao carregar dados do jogo. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [game.id, game.team_a, game.team_b])

  const handleScoreChange = (team: 'A' | 'B', value: number) => {
    const updatedGame = {
      ...game,
      [team === 'A' ? 'score_a' : 'score_b']: Math.max(0, value)
    }
    onUpdateGame(updatedGame)
  }

  const handleTimeUpdate = (time: string) => {
    onUpdateGame({ ...game, game_time: time })
  }

  const handlePeriodChange = (period: string) => {
    onUpdateGame({ ...game, period })
  }

  const handleAddEvent = async (newEvent: Omit<GameEvent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const player = players.find(p => p.id === newEvent.player_id);
      if (!player) throw new Error('Jogador não encontrado');

      const highlights = game.highlights || [];
      const updatedGame = {
        ...game,
        highlights: [
          ...highlights,
          {
            ...newEvent,
            created_at: new Date().toISOString()
          }
        ]
      };

      // Atualizar placar se for gol
      if (newEvent.type === 'goal') {
        updatedGame.score_a = newEvent.team === 'A' ? game.score_a + 1 : game.score_a;
        updatedGame.score_b = newEvent.team === 'B' ? game.score_b + 1 : game.score_b;
      }

      // Atualizar estatísticas do jogador
      const updatedStats = {
        goals: player.goals,
        yellow_cards: player.yellow_cards,
        red_cards: player.red_cards
      };

      switch (newEvent.type) {
        case 'goal':
          updatedStats.goals += 1;
          break;
        case 'yellow_card':
          updatedStats.yellow_cards += 1;
          break;
        case 'red_card':
          updatedStats.red_cards += 1;
          break;
      }

      const { error: playerError } = await supabase
        .from('players')
        .update(updatedStats)
        .eq('id', player.id);

      if (playerError) throw playerError;

      // Atualizar o estado local dos jogadores
      setPlayers(currentPlayers => 
        currentPlayers.map(p => 
          p.id === player.id 
            ? { ...p, ...updatedStats }
            : p
        )
      );

      onUpdateGame(updatedGame);
      toast.success('Evento adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar evento:', error);
      toast.error('Erro ao adicionar evento. Tente novamente.');
    }
  };

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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl p-3 sm:p-6">
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{game.sport}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{game.category}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-6 sm:mb-8">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {game.team_a_name}
            </h3>
            <input
              type="number"
              value={game.score_a}
              onChange={(e) => handleScoreChange('A', parseInt(e.target.value))}
              min="0"
              className="w-20 sm:w-24 text-center text-3xl sm:text-4xl font-bold bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg py-1.5 sm:py-2"
            />
          </div>

          <div className="text-center space-y-3 sm:space-y-4">
            <GameTimer initialTime={game.game_time} onTimeUpdate={handleTimeUpdate} />
            
            <select
              value={game.period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="w-full text-sm sm:text-base rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3"
            >
              <option>1º Tempo</option>
              <option>2º Tempo</option>
              <option>Intervalo</option>
              <option>Prorrogação</option>
              <option>Finalizado</option>
            </select>
          </div>

          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {game.team_b_name}
            </h3>
            <input
              type="number"
              value={game.score_b}
              onChange={(e) => handleScoreChange('B', parseInt(e.target.value))}
              min="0"
              className="w-20 sm:w-24 text-center text-3xl sm:text-4xl font-bold bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg py-1.5 sm:py-2"
            />
          </div>
        </div>

        <GameEvents
          game={game}
          players={players}
          onAddEvent={handleAddEvent}
        />
      </div>
    </motion.div>
  )
}

export default GameDetails 