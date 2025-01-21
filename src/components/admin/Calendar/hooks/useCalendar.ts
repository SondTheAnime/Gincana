import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../../lib/supabase'
import { toast } from 'sonner'
import { Match, Team, Player, CalendarFilters } from '../types'
import { filterMatches, getMonthRange, groupMatchesByDate, sortMatchesByDateTime } from '../utils'

export function useCalendar() {
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  })
  const [matches, setMatches] = useState<Match[]>([])
  const [groupedMatches, setGroupedMatches] = useState<Record<string, Match[]>>({})
  const [teams, setTeams] = useState<Team[]>([])
  const [sports, setSports] = useState<string[]>([])
  const [filters, setFilters] = useState<CalendarFilters>({})
  const [players, setPlayers] = useState<Player[]>([])
  const [loadingPlayers, setLoadingPlayers] = useState(false)

  const locations = ['IFPA']
  const categories = ['Masculino', 'Feminino', 'Misto']

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true)
      const { startDate, endDate } = getMonthRange(selectedMonth)

      const { data: gamesData, error } = await supabase
        .from('games')
        .select(`
          id,
          sport,
          category,
          team_a,
          team_b,
          score_a,
          score_b,
          date,
          time,
          game_time,
          period,
          location,
          status,
          created_at,
          updated_at,
          highlights,
          team_a_name,
          team_b_name
        `)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date')
        .order('time')

      if (error) throw error

      const formattedData = (gamesData || []).map(game => ({
        id: game.id,
        date: game.date,
        time: game.time,
        sport: game.sport,
        category: game.category,
        location: game.location,
        status: game.status,
        team_a: game.team_a,
        team_b: game.team_b,
        team_a_name: game.team_a_name || 'Time não encontrado',
        team_b_name: game.team_b_name || 'Time não encontrado',
        score_a: game.score_a || 0,
        score_b: game.score_b || 0,
        game_time: game.game_time,
        period: game.period,
        highlights: game.highlights || [],
        created_at: game.created_at,
        updated_at: game.updated_at
      }))

      const sortedMatches = sortMatchesByDateTime(formattedData)
      const filteredMatches = filterMatches(sortedMatches, filters)
      const grouped = groupMatchesByDate(filteredMatches)

      setMatches(sortedMatches)
      setGroupedMatches(grouped)
    } catch (error) {
      console.error('Erro ao buscar jogos:', error)
      toast.error('Erro ao carregar jogos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [selectedMonth, filters])

  const fetchTeams = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setTeams(data as Team[] || [])
    } catch (error) {
      console.error('Erro ao buscar times:', error)
      toast.error('Erro ao carregar times. Tente novamente.')
    }
  }, [])

  const fetchSports = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('modalities')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setSports(data?.map(sport => sport.name) || [])
    } catch (error) {
      console.error('Erro ao buscar modalidades:', error)
      toast.error('Erro ao carregar modalidades. Tente novamente.')
    }
  }, [])

  const fetchPlayers = useCallback(async (teamIds: number[]) => {
    setLoadingPlayers(true)
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .in('team_id', teamIds)
        .order('name')

      if (error) throw error
      setPlayers(data || [])
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error)
      toast.error('Erro ao carregar jogadores')
    } finally {
      setLoadingPlayers(false)
    }
  }, [])

  const startMatch = useCallback(async (match: Match) => {
    try {
      const { error } = await supabase
        .from('games')
        .update({
          status: 'live',
          game_time: '00:00',
          period: 'in_progress'
        })
        .eq('id', match.id)

      if (error) throw error

      toast.success('Partida iniciada com sucesso!')
      fetchMatches()
    } catch (error) {
      console.error('Erro ao iniciar partida:', error)
      toast.error('Erro ao iniciar partida. Tente novamente.')
    }
  }, [fetchMatches])

  const updateMatch = useCallback(async (match: Match) => {
    try {
      const { error } = await supabase
        .from('games')
        .update({
          sport: match.sport,
          category: match.category,
          team_a: match.team_a,
          team_b: match.team_b,
          date: match.date,
          time: match.time,
          location: match.location,
          status: match.status,
        })
        .eq('id', match.id)

      if (error) throw error

      toast.success('Jogo atualizado com sucesso!')
      fetchMatches()
    } catch (error) {
      console.error('Erro ao atualizar jogo:', error)
      toast.error('Erro ao atualizar jogo. Tente novamente.')
    }
  }, [fetchMatches])

  const deleteMatch = useCallback(async (match: Match) => {
    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', match.id)

      if (error) throw error

      toast.success('Jogo excluído com sucesso!')
      fetchMatches()
    } catch (error) {
      console.error('Erro ao excluir jogo:', error)
      toast.error('Erro ao excluir jogo. Tente novamente.')
    }
  }, [fetchMatches])

  useEffect(() => {
    fetchMatches()
  }, [fetchMatches])

  useEffect(() => {
    fetchTeams()
    fetchSports()
  }, [fetchTeams, fetchSports])

  return {
    loading,
    selectedMonth,
    matches,
    groupedMatches,
    teams,
    sports,
    filters,
    locations,
    categories,
    players,
    loadingPlayers,
    setSelectedMonth,
    setFilters,
    startMatch,
    updateMatch,
    fetchPlayers,
    deleteMatch,
  }
} 