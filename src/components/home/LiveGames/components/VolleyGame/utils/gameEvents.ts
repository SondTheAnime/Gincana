import { createClient } from '@supabase/supabase-js'

export interface GameEvent {
  id: number
  game_id: number
  type: string
  team: string
  player_id?: number
  player_name?: string
  description: string
  created_at: string
  updated_at: string
  point_type?: 'attack' | 'block' | 'ace' | 'opponent_error'
  remaining_timeouts?: number
  players?: {
    name: string
  }
}

const supabase = createClient(
  'https://flteyjqkhbyrdjtowslt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsdGV5anFraGJ5cmRqdG93c2x0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2MjMwMDUsImV4cCI6MjA1MjE5OTAwNX0.XTVuSW5Ru1O2PLySuSj7AodDBKqYUexxgzVVag1A3Xw'
)

export async function getGameEvents(gameId: number): Promise<GameEvent[]> {
  try {
    const { data, error } = await supabase
      .from('game_events')
      .select(`
        *,
        players:player_id (
          name
        )
      `)
      .eq('game_id', gameId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return formatGameEvents(data || [])
  } catch (error) {
    console.error('Erro ao buscar eventos do jogo:', error)
    return []
  }
}

export function formatGameEvents(events: GameEvent[]) {
  return events.map(event => ({
    ...event,
    created_at: new Date(event.created_at).toISOString(),
    updated_at: new Date(event.updated_at).toISOString()
  }))
}

export function getPointTypeLabel(type?: string): string {
  switch (type) {
    case 'attack':
      return 'Ataque'
    case 'block':
      return 'Bloqueio'
    case 'ace':
      return 'Ace'
    case 'opponent_error':
      return 'Erro do adversário'
    default:
      return 'Ponto'
  }
} 