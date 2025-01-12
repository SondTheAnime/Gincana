import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Game } from './types'
import { toast } from 'react-toastify'
import GameDetails from './GameDetails'
import LiveGames from './LiveGames'

const ManageScore = () => {
  const [loading, setLoading] = useState(true)
  const [games, setGames] = useState<Game[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data, error } = await supabase
          .from('games')
          .select(`
            id,
            sport,
            category,
            team_a,
            team_b,
            team_a_name,
            team_b_name,
            score_a,
            score_b,
            date,
            time,
            game_time,
            period,
            location,
            status,
            highlights
          `)
          .eq('status', 'live')
          .order('date')
          .order('time')

        if (error) throw error

        setGames(data || [])
      } catch (error) {
        console.error('Erro ao buscar jogos:', error)
        toast.error('Erro ao carregar jogos. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchGames()

    // Inscrever para atualizações em tempo real
    const subscription = supabase
      .channel('live_games')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: 'status=eq.live'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setGames(current => [...current, payload.new as Game])
          } else if (payload.eventType === 'UPDATE') {
            setGames(current =>
              current.map(game =>
                game.id === payload.new.id ? { ...game, ...payload.new } : game
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setGames(current =>
              current.filter(game => game.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleUpdateGame = async (updatedGame: Game) => {
    try {
      const { error } = await supabase
        .from('games')
        .update({
          score_a: updatedGame.score_a,
          score_b: updatedGame.score_b,
          game_time: updatedGame.game_time,
          period: updatedGame.period,
          highlights: updatedGame.highlights || [],
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedGame.id)

      if (error) throw error

      setGames(games.map(game => 
        game.id === updatedGame.id ? updatedGame : game
      ))
    } catch (error) {
      console.error('Erro ao atualizar jogo:', error)
      toast.error('Erro ao atualizar jogo. Tente novamente.')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gerenciar Placar</h2>

      <LiveGames
        games={games}
        onSelectGame={setSelectedGame}
      />

      {selectedGame && (
        <GameDetails
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          onUpdateGame={handleUpdateGame}
        />
      )}
    </div>
  )
}

export default ManageScore 