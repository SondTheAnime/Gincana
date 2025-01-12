import { useState, useEffect } from 'react'
import { Game } from './types'
import GameDetails from './GameDetails'
import { supabase } from '../../../lib/supabase'
import { toast } from 'react-toastify'

const ManageScore = () => {
  const [games, setGames] = useState<Game[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data, error } = await supabase
          .from('games')
          .select(`
            id,
            sport,
            team_a,
            team_b,
            score_a,
            score_b,
            date,
            time,
            game_time,
            period,
            location,
            category,
            highlights,
            status,
            created_at,
            updated_at,
            team_a_name:teams!games_team_a_fkey(name),
            team_b_name:teams!games_team_b_fkey(name)
          `)
          .eq('status', 'live')
          .order('created_at', { ascending: false })

        if (error) throw error

        const formattedGames = (data || []).map(game => ({
          ...game,
          team_a_name: game.team_a_name?.[0]?.name,
          team_b_name: game.team_b_name?.[0]?.name
        }))

        setGames(formattedGames)
      } catch (error) {
        console.error('Erro ao buscar jogos:', error)
        toast.error('Erro ao carregar jogos. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

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
        async (payload) => {
          // Recarregar os dados quando houver mudanças
          await fetchGames()
        }
      )
      .subscribe()

    fetchGames()

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
          highlights: updatedGame.highlights,
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

      {games.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum jogo ao vivo no momento
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map(game => (
            <div
              key={game.id}
              onClick={() => setSelectedGame(game)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{game.sport}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{game.category}</p>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  AO VIVO
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-center flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1 truncate">
                    {game.team_a_name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {game.score_a}
                  </p>
                </div>
                <div className="text-center px-4">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {game.period}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white font-mono">
                    {game.game_time}
                  </p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1 truncate">
                    {game.team_b_name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {game.score_b}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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