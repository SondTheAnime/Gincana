import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { toast } from 'react-toastify'
import { Game } from './types'
import VolleyballScore from './modalities/volleyball/VolleyballScore'
import TableTennisScore from './modalities/table-tennis/TableTennisScore'
import { VolleyballGame } from './modalities/volleyball/types'
import { TableTennisGame } from './modalities/table-tennis/types'

const ManageScore = () => {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGame, setSelectedGame] = useState<Game | VolleyballGame | TableTennisGame | null>(null)

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
    if (game.sport === 'Vôlei' || game.sport === 'Tênis de Mesa') {
      try {
        // Verificar se já existem sets para este jogo
        let { data: existingSets, error: setsError } = await supabase
          .from('game_sets')
          .select('*')
          .eq('game_id', game.id)
          .order('set_number')

        if (setsError) throw setsError

        // Se não existirem sets, criar os sets iniciais
        if (!existingSets || existingSets.length === 0) {
          const totalSets = game.sport === 'Vôlei' ? 5 : 7
          const setsToCreate = Array.from({ length: totalSets }, (_, i) => ({
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
        const detailsTable = game.sport === 'Vôlei' ? 'volleyball_game_details' : 'table_tennis_game_details'
        const { data: details, error: detailsError } = await supabase
          .from(detailsTable)
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
            .from(detailsTable)
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
          const defaultConfig = game.sport === 'Vôlei' 
            ? {
                total_sets: 5,
                points_per_set: 25,
                points_last_set: 15,
                min_difference: 2,
                max_timeouts: 2,
                max_substitutions: 6
              }
            : {
                total_sets: 7,
                points_per_set: 11,
                min_difference: 2,
                max_timeouts: 1
              }

          const { data: newConfig, error: createConfigError } = await supabase
            .from('game_configs')
            .insert([{
              game_id: game.id,
              ...defaultConfig
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

        const updatedGame = {
          ...game,
          details: gameDetails,
          config: gameConfig,
          sets: existingSets,
          highlights: events || [],
          period: game.status === 'finished' ? 'finished' : game.status === 'live' ? 'in_progress' : 'not_started',
          game_time: '00:00'
        }

        setSelectedGame(game.sport === 'Vôlei' 
          ? updatedGame as VolleyballGame 
          : updatedGame as TableTennisGame
        )
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

  const handleUpdateGame = async (game: VolleyballGame | TableTennisGame) => {
    try {
      const { error } = await supabase
        .from('games')
        .update({
          status: game.period === 'finished' ? 'finished' : game.period === 'in_progress' ? 'live' : 'scheduled'
        })
        .eq('id', game.id)

      if (error) throw error

      setSelectedGame(game)
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

      {selectedGame ? (
        <div>
          <button
            onClick={handleCloseGame}
            className="mb-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            ← Voltar
          </button>

          {selectedGame.sport === 'Vôlei' && (
            <VolleyballScore
              game={selectedGame as VolleyballGame}
              onUpdateGame={handleUpdateGame}
              onClose={handleCloseGame}
            />
          )}

          {selectedGame.sport === 'Tênis de Mesa' && (
            <TableTennisScore
              game={selectedGame as TableTennisGame}
              onUpdateGame={handleUpdateGame}
              onClose={handleCloseGame}
            />
          )}
        </div>
      ) : (
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
      )}
    </div>
  )
}

export default ManageScore 