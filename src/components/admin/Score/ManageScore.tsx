import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { toast } from 'react-toastify'
import { Game } from './types'
import VolleyballScore from './modalities/volleyball/VolleyballScore'
import { VolleyballGame } from './modalities/volleyball/types'

const ManageScore = () => {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .order('date', { ascending: true })
          .order('time', { ascending: true })

        if (error) throw error

        setGames(data || [])
      } catch (error) {
        console.error('Erro ao carregar jogos:', error)
        toast.error('Erro ao carregar jogos. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  const handleGameClick = async (game: Game) => {
    if (game.sport === 'Vôlei') {
      try {
        // Verificar se já existem sets para este jogo
        let { data: existingSets, error: setsError } = await supabase
          .from('game_sets')
          .select('*')
          .eq('game_id', game.id)
          .order('set_number')

        if (setsError) throw setsError

        // Se não existirem sets, criar os 5 sets iniciais
        if (!existingSets || existingSets.length === 0) {
          const setsToCreate = Array.from({ length: 5 }, (_, i) => ({
            game_id: game.id,
            set_number: i + 1,
            score_a: 0,
            score_b: 0,
            winner: null,
            status: 'not_started'
          }))

          const { data: newSets, error: createError } = await supabase
            .from('game_sets')
            .insert(setsToCreate)
            .select()

          if (createError) throw createError
          existingSets = newSets
        }

        // Buscar detalhes do jogo
        const { data: details, error: detailsError } = await supabase
          .from('volleyball_game_details')
          .select('*')
          .eq('game_id', game.id)
          .single()

        if (detailsError && detailsError.code !== 'PGRST116') {
          throw detailsError
        }

        // Se não houver detalhes, criar
        let gameDetails = details
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
          gameDetails = newDetails
        }

        // Buscar configurações do jogo
        const { data: config, error: configError } = await supabase
          .from('game_configs')
          .select('*')
          .eq('game_id', game.id)
          .single()

        if (configError && configError.code !== 'PGRST116') {
          throw configError
        }

        // Se não houver configuração, criar
        let gameConfig = config
        if (!config) {
          const { data: newConfig, error: createConfigError } = await supabase
            .from('game_configs')
            .insert([{
              game_id: game.id,
              total_sets: 5,
              points_per_set: 25,
              points_last_set: 15,
              min_difference: 2,
              max_timeouts: 2,
              max_substitutions: 6
            }])
            .select()
            .single()

          if (createConfigError) throw createConfigError
          gameConfig = newConfig
        }

        // Buscar eventos do jogo
        const { data: events, error: eventsError } = await supabase
          .from('game_events')
          .select('*')
          .eq('game_id', game.id)
          .order('created_at', { ascending: false })

        if (eventsError) throw eventsError

        setSelectedGame({
          ...game,
          details: gameDetails,
          config: gameConfig,
          sets: existingSets,
          highlights: events || []
        } as unknown as Game)
      } catch (error) {
        console.error('Erro ao preparar jogo:', error)
        toast.error('Erro ao preparar o jogo')
        return
      }
    } else {
      setSelectedGame(game)
    }
  }

  const handleCloseGame = () => {
    setSelectedGame(null)
  }

  const handleUpdateGame = async (game: Game | VolleyballGame) => {
    try {
      const { error } = await supabase
        .from('games')
        .update({
          period: game.period,
          game_time: game.game_time
        })
        .eq('id', game.id)

      if (error) throw error

      setSelectedGame(game as Game)
      toast.success('Jogo atualizado com sucesso')
    } catch (error) {
      console.error('Erro ao atualizar jogo:', error)
      toast.error('Erro ao atualizar jogo')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Gerenciar Placares
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => handleGameClick(game)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {game.sport}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {game.category}
                </p>
              </div>
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${game.status === 'finished'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                  : game.status === 'live'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200'
                }
              `}>
                {game.status === 'finished'
                  ? 'Finalizado'
                  : game.status === 'live'
                  ? 'Ao Vivo'
                  : 'Agendado'
                }
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  {game.team_a_name}
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {game.score_a}
                </span>
              </div>
              <div className="text-center px-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  vs
                </span>
              </div>
              <div className="text-center flex-1">
                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  {game.team_b_name}
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {game.score_b}
                </span>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p>Data: {new Date(game.date).toLocaleDateString()}</p>
              <p>Horário: {game.time}</p>
              <p>Local: {game.location}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedGame && (
        selectedGame.sport === 'Vôlei' ? (
          <VolleyballScore
            game={{
              ...(selectedGame as unknown as Partial<VolleyballGame>),
              period: (selectedGame.period || 'not_started') as 'not_started' | 'in_progress' | 'finished',
              game_time: selectedGame.game_time || '00:00',
              details: (selectedGame as any).details || {
                id: 0,
                game_id: selectedGame.id,
                current_set: 1,
                points_a: 0,
                points_b: 0,
                timeouts_a: 0,
                timeouts_b: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              config: (selectedGame as any).config || {
                id: 0,
                game_id: selectedGame.id,
                total_sets: 5,
                points_per_set: 25,
                points_last_set: 15,
                min_difference: 2,
                max_timeouts: 2,
                max_substitutions: 6,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              sets: (selectedGame as any).sets || [],
              highlights: (selectedGame as any).highlights || []
            } as unknown as VolleyballGame}
            onClose={handleCloseGame}
            onUpdateGame={(game) => handleUpdateGame(game)}
          />
        ) : (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4">
                Gerenciamento de {selectedGame.sport} em desenvolvimento
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                O gerenciamento detalhado para esta modalidade ainda está sendo desenvolvido.
              </p>
              <button
                onClick={handleCloseGame}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default ManageScore 