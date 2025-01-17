import { useState, useEffect } from 'react'
import { supabase } from '../../../../../../lib/supabase'
import { toast } from 'react-toastify'
import { VolleyballGame } from '../types'
import { GameEvent, Player } from '../../../types'
import { Plus, X } from 'lucide-react'

interface VolleyballHighlightsProps {
  game: VolleyballGame
  onUpdateGame: (game: VolleyballGame) => void
}

const VolleyballHighlights = ({ game, onUpdateGame }: VolleyballHighlightsProps) => {
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<'A' | 'B'>('A')
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null)
  const [eventType, setEventType] = useState<'point' | 'timeout'>('point')
  const [pointType, setPointType] = useState<'attack' | 'ace' | 'block'>('attack')
  const [players, setPlayers] = useState<Player[]>([])
  const [highlights, setHighlights] = useState<GameEvent[]>(game.highlights || [])

  // Buscar highlights em tempo real
  useEffect(() => {
    const channel = supabase
      .channel('game_events')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_events',
          filter: `game_id=eq.${game.id}`
        },
        async () => {
          // Buscar todos os highlights atualizados
          const { data: updatedHighlights } = await supabase
            .from('game_events')
            .select('*')
            .eq('game_id', game.id)
            .order('created_at', { ascending: false })

          if (updatedHighlights) {
            setHighlights(updatedHighlights)
            onUpdateGame({
              ...game,
              highlights: updatedHighlights
            })
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [game.id])

  // Atualizar highlights quando o jogo mudar
  useEffect(() => {
    setHighlights(game.highlights || [])
  }, [game.highlights])

  // Calcular timeouts disponíveis para cada time no set atual
  const currentSet = game.sets.find(s => s.set_number === game.details.current_set)
  const timeoutsTeamA = (game.highlights || [])
    .filter(h => 
      h.type === 'timeout' && 
      h.team === 'A' && 
      h.description === `timeout_set_${currentSet?.set_number}`
    )
    .length

  const timeoutsTeamB = (game.highlights || [])
    .filter(h => 
      h.type === 'timeout' && 
      h.team === 'B' && 
      h.description === `timeout_set_${currentSet?.set_number}`
    )
    .length

  // Verificar se o time selecionado ainda tem timeouts disponíveis
  const hasTimeoutsAvailable = selectedTeam === 'A' 
    ? timeoutsTeamA < game.config.max_timeouts
    : timeoutsTeamB < game.config.max_timeouts

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .in('team_id', [game.team_a, game.team_b])
        .order('number')

      if (error) throw error
      setPlayers(data || [])
    } catch (error) {
      console.error('Erro ao carregar jogadores:', error)
      toast.error('Erro ao carregar jogadores')
    }
  }

  const handleAddEvent = async () => {
    if (!selectedPlayer && eventType === 'point') {
      toast.error('Selecione um jogador')
      return
    }

    setLoading(true)
    try {
      const currentSet = game.sets.find(s => s.set_number === game.details.current_set)
      if (!currentSet) throw new Error('Set atual não encontrado')

      // Criar o evento
      const newEvent: Omit<GameEvent, 'id' | 'created_at' | 'updated_at'> = {
        game_id: game.id,
        type: eventType,
        team: selectedTeam,
        player_id: selectedPlayer || undefined,
        description: eventType === 'point' ? pointType : `timeout_set_${currentSet.set_number}`
      }

      if (eventType === 'point') {
        // Buscar timeouts atualizados do banco de dados
        const { data: timeouts, error: timeoutsError } = await supabase
          .from('game_events')
          .select('*')
          .eq('game_id', game.id)
          .eq('type', 'timeout')
          .eq('team', selectedTeam)
          .eq('description', `timeout_set_${currentSet.set_number}`)

        if (timeoutsError) throw timeoutsError

        // Verificar se o time já usou todos os timeouts do set
        if (timeouts && timeouts.length >= game.config.max_timeouts) {
          toast.error(`Time ${selectedTeam === 'A' ? game.team_a_name : game.team_b_name} já usou todos os timeouts deste set`)
          return
        }

        // Adicionar o timeout
        const { error: eventError } = await supabase
          .from('game_events')
          .insert([{
            ...newEvent,
            description: `timeout_set_${currentSet.set_number}`
          }])

        if (eventError) throw eventError

        // Buscar todos os highlights atualizados
        const { data: updatedHighlights, error: highlightsError } = await supabase
          .from('game_events')
          .select('*')
          .eq('game_id', game.id)
          .order('created_at', { ascending: false })

        if (highlightsError) throw highlightsError

        // Atualizar o jogo com os highlights mais recentes
        onUpdateGame({
          ...game,
          highlights: updatedHighlights || []
        })

        // Fechar o modal
        setShowAddEvent(false)
      } else if (eventType === 'timeout') {
        const currentSet = game.sets.find(s => s.set_number === game.details.current_set)
        if (!currentSet) throw new Error('Set atual não encontrado')

        // Buscar timeouts atualizados do banco de dados
        const { data: timeouts, error: timeoutsError } = await supabase
          .from('game_events')
          .select('*')
          .eq('game_id', game.id)
          .eq('type', 'timeout')
          .eq('team', selectedTeam)
          .eq('description', `timeout_set_${currentSet.set_number}`)

        if (timeoutsError) throw timeoutsError

        // Verificar se o time já usou todos os timeouts do set
        if (timeouts && timeouts.length >= game.config.max_timeouts) {
          toast.error(`Time ${selectedTeam === 'A' ? game.team_a_name : game.team_b_name} já usou todos os timeouts deste set`)
          return
        }

        // Adicionar o timeout
        const { error: eventError } = await supabase
          .from('game_events')
          .insert([{
            ...newEvent,
            description: `timeout_set_${currentSet.set_number}`
          }])

        if (eventError) throw eventError

        // Buscar todos os highlights atualizados
        const { data: updatedHighlights, error: highlightsError } = await supabase
          .from('game_events')
          .select('*')
          .eq('game_id', game.id)
          .order('created_at', { ascending: false })

        if (highlightsError) throw highlightsError

        // Atualizar o jogo com os highlights mais recentes
        onUpdateGame({
          ...game,
          highlights: updatedHighlights || []
        })

        // Fechar o modal
        setShowAddEvent(false)
      }

      toast.success('Evento adicionado com sucesso')
    } catch (error) {
      console.error('Erro ao adicionar evento:', error)
      toast.error('Erro ao adicionar evento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Eventos do Jogo
        </h3>
        <button
          onClick={() => {
            setShowAddEvent(true)
            fetchPlayers()
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus size={16} />
          Adicionar Evento
        </button>
      </div>

      {/* Lista de Eventos */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {highlights.map((event, index) => (
          <div
            key={event.id || index}
            className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {event.type === 'point' ? '🏐 Ponto' : '⏱️ Timeout'}
              </span>
              <span className="text-sm text-gray-500">
                {event.team === 'A' ? game.team_a_name : game.team_b_name}
              </span>
              {event.player_id && (
                <span className="text-sm text-gray-500">
                  - {players.find(p => p.id === event.player_id)?.name}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400">
              {new Date(event.created_at).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      {/* Modal Adicionar Evento */}
      {showAddEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Adicionar Evento</h4>
              <button
                onClick={() => setShowAddEvent(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Tipo de Evento */}
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Evento</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as 'point' | 'timeout')}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2"
                >
                  <option value="point">Ponto</option>
                  {hasTimeoutsAvailable && (
                    <option value="timeout">Timeout</option>
                  )}
                </select>
                {!hasTimeoutsAvailable && eventType === 'timeout' && (
                  <p className="text-sm text-red-500 mt-1">
                    Time {selectedTeam === 'A' ? game.team_a_name : game.team_b_name} já usou todos os timeouts deste set
                  </p>
                )}
              </div>

              {/* Tipo de Ponto (apenas para pontos) */}
              {eventType === 'point' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Ponto</label>
                  <select
                    value={pointType}
                    onChange={(e) => setPointType(e.target.value as 'attack' | 'ace' | 'block')}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2"
                  >
                    <option value="attack">Ataque</option>
                    <option value="ace">Ace</option>
                    <option value="block">Bloqueio</option>
                  </select>
                </div>
              )}

              {/* Time */}
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value as 'A' | 'B')}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2"
                >
                  <option value="A">{game.team_a_name}</option>
                  <option value="B">{game.team_b_name}</option>
                </select>
              </div>

              {/* Jogador (apenas para pontos) */}
              {eventType === 'point' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Jogador</label>
                  <select
                    value={selectedPlayer || ''}
                    onChange={(e) => setSelectedPlayer(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2"
                  >
                    <option value="">Selecione um jogador</option>
                    {players
                      .filter(p => p.team_id === (selectedTeam === 'A' ? game.team_a : game.team_b))
                      .map(player => (
                        <option key={player.id} value={player.id}>
                          {player.number} - {player.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <button
                onClick={handleAddEvent}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Adicionando...' : 'Adicionar Evento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VolleyballHighlights 