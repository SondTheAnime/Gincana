import { useState, useEffect } from 'react';
import { CalendarIcon, Edit2, Play, MapPin, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-toastify';
import { Team, Match, GameEvent, GameStatus } from './types';

interface Player {
  id: number;
  name: string;
  number: number;
  team_id: number;
  photo?: string;
  goals: number;
  yellow_cards: number;
  red_cards: number;
}

const ManageCalendar = () => {
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  const [groupedMatches, setGroupedMatches] = useState<Record<string, Match[]>>({});
  const [isEditingMatch, setIsEditingMatch] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [sports, setSports] = useState<string[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  const locations = ['Quadra Principal', 'Quadra Coberta', 'Campo', 'Piscina', 'Ginásio'];
  const categories = ['Masculino', 'Feminino', 'Misto'];

  const fetchMatches = async () => {
    try {
      const [year, month] = selectedMonth.split('-');
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0);

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
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date')
        .order('time');

      if (error) throw error;

      // Transformar os dados para incluir os nomes dos times no formato esperado
      const formattedData = (gamesData || []).map(game => {
        // Parse dos highlights de string JSON para objetos
        const highlights = (game.highlights || []).map((highlight: string | GameEvent) => {
          try {
            return typeof highlight === 'string' ? JSON.parse(highlight) : highlight;
          } catch (e) {
            console.error('Erro ao fazer parse do highlight:', e);
            return null;
          }
        }).filter(Boolean);

        return {
          id: game.id,
          date: game.date,
          time: game.time,
          sport: game.sport,
          category: game.category,
          location: game.location,
          status: game.status as GameStatus,
          team_a: game.team_a,
          team_b: game.team_b,
          team_a_name: game.team_a_name || 'Time não encontrado',
          team_b_name: game.team_b_name || 'Time não encontrado',
          score_a: game.score_a || 0,
          score_b: game.score_b || 0,
          game_time: game.game_time,
          period: game.period,
          highlights
        };
      }) as Match[];

      // Agrupar jogos por data
      const groupedGames = formattedData.reduce((acc, match) => {
        if (!acc[match.date]) {
          acc[match.date] = [];
        }
        acc[match.date].push(match);
        return acc;
      }, {} as Record<string, Match[]>);

      setGroupedMatches(groupedGames);
    } catch (error) {
      console.error('Erro ao buscar jogos:', error);
      toast.error('Erro ao carregar jogos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('name');

      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error);
      toast.error('Erro ao carregar jogadores');
    }
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;
        setTeams(data as Team[] || []);
      } catch (error) {
        console.error('Erro ao buscar times:', error);
        toast.error('Erro ao carregar times. Tente novamente.');
      }
    };

    const fetchSports = async () => {
      try {
        const { data, error } = await supabase
          .from('modalities')
          .select('*')
          .eq('is_team_sport', true)
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        setSports(data?.map(sport => sport.name) || []);
      } catch (error) {
        console.error('Erro ao buscar modalidades:', error);
        toast.error('Erro ao carregar modalidades. Tente novamente.');
      }
    };

    fetchTeams();
    fetchSports();
  }, []);

  useEffect(() => {
    if (editingMatch) {
      const filtered = teams.filter(team => 
        (!editingMatch.sport || team.modality === editingMatch.sport) &&
        (!editingMatch.category || team.category === editingMatch.category)
      );
      setFilteredTeams(filtered);
    }
  }, [editingMatch?.sport, editingMatch?.category, teams]);

  useEffect(() => {
    fetchMatches();
  }, [selectedMonth]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match);
    setIsEditingMatch(true);
  };

  const handleStartMatch = async (match: Match) => {
    try {
      const { error } = await supabase
        .from('games')
        .update({
          status: 'live' as GameStatus,
          game_time: '00:00',
          period: 'in_progress'
        })
        .eq('id', match.id);

      if (error) throw error;

      toast.success('Partida iniciada com sucesso!');
      fetchMatches();
    } catch (error) {
      console.error('Erro ao iniciar partida:', error);
      toast.error('Erro ao iniciar partida. Tente novamente.');
    }
  };

  const handleUpdateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatch) return;

    try {
      const { error } = await supabase
        .from('games')
        .update({
          sport: editingMatch.sport,
          category: editingMatch.category,
          team_a: editingMatch.team_a,
          team_b: editingMatch.team_b,
          date: editingMatch.date,
          time: editingMatch.time,
          location: editingMatch.location,
          status: editingMatch.status,
        })
        .eq('id', editingMatch.id);

      if (error) throw error;

      toast.success('Jogo atualizado com sucesso!');
      setIsEditingMatch(false);
      setEditingMatch(null);
      fetchMatches();
    } catch (error) {
      console.error('Erro ao atualizar jogo:', error);
      toast.error('Erro ao atualizar jogo. Tente novamente.');
    }
  };

  const handleChangeMatch = (field: keyof Match, value: any) => {
    if (!editingMatch) return;
    setEditingMatch({ ...editingMatch, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Calendário</h2>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full sm:w-auto rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
          >
            <option value="2025-01">Janeiro 2025</option>
            <option value="2025-02">Fevereiro 2025</option>
            <option value="2025-03">Março 2025</option>
            <option value="2025-04">Abril 2025</option>
            <option value="2025-05">Maio 2025</option>
            <option value="2025-06">Junho 2025</option>
            <option value="2025-07">Julho 2025</option>
            <option value="2025-08">Agosto 2025</option>
            <option value="2025-09">Setembro 2025</option>
            <option value="2025-10">Outubro 2025</option>
            <option value="2025-11">Novembro 2025</option>
            <option value="2025-12">Dezembro 2025</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        {Object.entries(groupedMatches).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Nenhum jogo encontrado para este período.</p>
          </div>
        ) : (
          Object.entries(groupedMatches).map(([date, dayMatches]) => (
            <div key={date} className="space-y-3 md:space-y-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300">
                {new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </h3>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {dayMatches.map(match => (
                    <div key={match.id} className="p-3 md:p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{match.time}</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                              {match.sport}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
                              {match.category}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              match.status === 'scheduled' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' :
                              match.status === 'live' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                              match.status === 'finished' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                              'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            }`}>
                              {match.status === 'scheduled' ? 'Agendado' :
                               match.status === 'live' ? 'Ao Vivo' :
                               match.status === 'finished' ? 'Finalizado' :
                               'Cancelado'}
                            </span>
                          </div>
                          <div className="mt-2 text-sm md:text-base">
                            <span className="font-medium">{match.team_a_name}</span>
                            {(match.status === 'live' || match.status === 'finished') && (
                              <span className="mx-2 font-bold">{match.score_a} - {match.score_b}</span>
                            )}
                            <span className="mx-2 text-gray-400">vs</span>
                            <span className="font-medium">{match.team_b_name}</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{match.location}</span>
                          </div>
                          {(match.highlights?.length ?? 0) > 0 && (
                            <div className="mt-2 space-y-1">
                              {match.highlights?.map((event: GameEvent, index: number) => {
                                const player = players.find(p => p.id === event.player_id);
                                return (
                                  <div key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                                    <span>{new Date(event.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span>-</span>
                                    <span>
                                      {event.type === 'goal' && `⚽ Gol - ${player?.name || 'Jogador não encontrado'} (#${player?.number || '?'})`}
                                      {event.type === 'yellow_card' && `🟨 Cartão Amarelo - ${player?.name || 'Jogador não encontrado'} (#${player?.number || '?'})`}
                                      {event.type === 'red_card' && `🟥 Cartão Vermelho - ${player?.name || 'Jogador não encontrado'} (#${player?.number || '?'})`}
                                      {event.type === 'substitution' && `🔄 Substituição - ${player?.name || 'Jogador não encontrado'} (#${player?.number || '?'})`}
                                    </span>
                                    <span>-</span>
                                    <span>{event.team === 'A' ? match.team_a_name : match.team_b_name}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {match.status === 'scheduled' && (
                            <button
                              onClick={() => handleStartMatch(match)}
                              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                            >
                              <Play className="h-3 w-3" />
                              <span>Iniciar</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleEditMatch(match)}
                            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md"
                          >
                            <Edit2 className="h-3 w-3" />
                            <span>Editar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Match Modal */}
      {isEditingMatch && editingMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Editar Jogo</h3>
              <button
                onClick={() => {
                  setIsEditingMatch(false);
                  setEditingMatch(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateMatch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Modalidade
                </label>
                <select
                  value={editingMatch.sport}
                  onChange={(e) => handleChangeMatch('sport', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 text-sm"
                  required
                >
                  <option value="">Selecione uma modalidade</option>
                  {sports.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoria
                </label>
                <select
                  value={editingMatch.category}
                  onChange={(e) => handleChangeMatch('category', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 text-sm"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time A
                </label>
                <select
                  value={editingMatch.team_a}
                  onChange={(e) => handleChangeMatch('team_a', parseInt(e.target.value))}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 text-sm"
                  required
                >
                  <option value="">Selecione o primeiro time</option>
                  {filteredTeams
                    .filter(team => team.id !== editingMatch.team_b)
                    .map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time B
                </label>
                <select
                  value={editingMatch.team_b}
                  onChange={(e) => handleChangeMatch('team_b', parseInt(e.target.value))}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 text-sm"
                  required
                >
                  <option value="">Selecione o segundo time</option>
                  {filteredTeams
                    .filter(team => team.id !== editingMatch.team_a)
                    .map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data
                </label>
                <input
                  type="date"
                  value={editingMatch.date}
                  onChange={(e) => handleChangeMatch('date', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Horário
                </label>
                <input
                  type="time"
                  value={editingMatch.time}
                  onChange={(e) => handleChangeMatch('time', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Local
                </label>
                <select
                  value={editingMatch.location}
                  onChange={(e) => handleChangeMatch('location', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 text-sm"
                  required
                >
                  <option value="">Selecione o local</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={editingMatch.status}
                  onChange={(e) => handleChangeMatch('status', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 text-sm"
                  required
                >
                  <option value="scheduled">Agendado</option>
                  <option value="live">Ao Vivo</option>
                  <option value="finished">Finalizado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingMatch(false);
                    setEditingMatch(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 rounded-md"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCalendar; 