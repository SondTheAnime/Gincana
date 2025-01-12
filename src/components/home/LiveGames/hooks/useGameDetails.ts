import { useState, useEffect } from 'react'
import { supabase } from '../../../../lib/supabase'
import { Game, Player, GameStats, TeamLineup, GameEvent } from '../types'
import { toast } from 'react-toastify'

interface UseGameDetailsProps {
  gameId: number
}

interface UseGameDetailsReturn {
  game: Game | null
  teamALineup: TeamLineup | null
  teamBLineup: TeamLineup | null
  gameStats: Record<number, GameStats>
  loading: boolean
  error: Error | null
}

export const useGameDetails = ({ gameId }: UseGameDetailsProps): UseGameDetailsReturn => {
  const [game, setGame] = useState<Game | null>(null)
  const [teamALineup, setTeamALineup] = useState<TeamLineup | null>(null)
  const [teamBLineup, setTeamBLineup] = useState<TeamLineup | null>(null)
  const [gameStats, setGameStats] = useState<Record<number, GameStats>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Função para calcular estatísticas a partir dos highlights
  const calculateStats = (highlights: GameEvent[], players: Player[]): Record<number, GameStats> => {
    const stats: Record<number, GameStats> = {}

    // Inicializar estatísticas para todos os jogadores
    players.forEach(player => {
      stats[player.id] = {
        player_id: player.id,
        game_id: gameId,
        goals: 0,
        assists: 0,
        yellow_cards: 0,
        red_cards: 0,
        minutes_played: 0,
        team: 'A' // Será atualizado depois
      }
    })

    // Calcular estatísticas baseado nos highlights
    highlights.forEach(event => {
      const playerStats = stats[event.player_id]
      if (playerStats) {
        playerStats.team = event.team
        switch (event.type) {
          case 'goal':
            playerStats.goals++
            break
          case 'yellow_card':
            playerStats.yellow_cards++
            break
          case 'red_card':
            playerStats.red_cards++
            break
        }
      }
    })

    // Calcular minutos jogados (simplificado - assumindo que todos jogaram o tempo todo)
    const currentTime = new Date()
    const gameStartTime = game?.date && game?.time 
      ? new Date(`${game.date}T${game.time}`) 
      : currentTime

    const minutesPlayed = Math.floor((currentTime.getTime() - gameStartTime.getTime()) / (1000 * 60))
    
    Object.values(stats).forEach(stat => {
      stat.minutes_played = Math.max(0, Math.min(minutesPlayed, 90)) // Limitando a 90 minutos
    })

    return stats
  }

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        // Buscar detalhes do jogo
        const { data: gameData, error: gameError } = await supabase
          .from('games')
          .select('*')
          .eq('id', gameId)
          .single()

        if (gameError) throw gameError

        // Buscar jogadores do time A
        const { data: teamAPlayers, error: teamAError } = await supabase
          .from('players')
          .select('*')
          .eq('team_id', gameData.team_a)

        if (teamAError) throw teamAError

        // Buscar jogadores do time B
        const { data: teamBPlayers, error: teamBError } = await supabase
          .from('players')
          .select('*')
          .eq('team_id', gameData.team_b)

        if (teamBError) throw teamBError

        // Parse dos highlights
        const parsedHighlights = (gameData.highlights || []).map((highlight: string) => {
          try {
            return typeof highlight === 'string' ? JSON.parse(highlight) : highlight
          } catch (e) {
            console.error('Erro ao fazer parse do highlight:', e)
            return null
          }
        }).filter(Boolean)

        // Atualizar o jogo com os highlights parseados
        const gameWithParsedHighlights = {
          ...gameData,
          highlights: parsedHighlights
        }

        // Calcular estatísticas
        const allPlayers = [...teamAPlayers, ...teamBPlayers]
        const calculatedStats = calculateStats(parsedHighlights, allPlayers)

        // Organizar os dados
        setGame(gameWithParsedHighlights)
        setTeamALineup({
          team_id: gameData.team_a,
          team_name: gameData.team_a_name,
          players: teamAPlayers
        })
        setTeamBLineup({
          team_id: gameData.team_b,
          team_name: gameData.team_b_name,
          players: teamBPlayers
        })
        setGameStats(calculatedStats)

      } catch (err) {
        setError(err as Error)
        toast.error('Erro ao carregar detalhes do jogo')
      } finally {
        setLoading(false)
      }
    }

    const subscription = supabase
      .channel(`game_details_${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            const updatedGame = payload.new as Game
            // Parse highlights ao receber atualização
            const parsedHighlights = (updatedGame.highlights || []).map((highlight: string) => {
              try {
                return typeof highlight === 'string' ? JSON.parse(highlight) : highlight
              } catch (e) {
                console.error('Erro ao fazer parse do highlight:', e)
                return null
              }
            }).filter(Boolean)

            const gameWithParsedHighlights = {
              ...updatedGame,
              highlights: parsedHighlights
            }

            setGame(gameWithParsedHighlights)

            // Recalcular estatísticas
            if (teamALineup && teamBLineup) {
              const allPlayers = [...teamALineup.players, ...teamBLineup.players]
              const calculatedStats = calculateStats(parsedHighlights, allPlayers)
              setGameStats(calculatedStats)
            }
          }
        }
      )
      .subscribe()

    fetchGameDetails()

    return () => {
      subscription.unsubscribe()
    }
  }, [gameId])

  return {
    game,
    teamALineup,
    teamBLineup,
    gameStats,
    loading,
    error
  }
} 