import { useState, useEffect } from 'react';
import { ChevronDown, Filter, Trophy } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';

interface Match {
  id: number;
  date: string;
  time: string;
  sport: string;
  team_a: number;
  team_b: number;
  team_a_name?: string;
  team_b_name?: string;
  location: string;
  category: string;
  status: 'scheduled' | 'live' | 'finished' | 'cancelled';
  score_a?: number;
  score_b?: number;
  game_time?: string;
  period?: string;
  highlights?: string;
}

const UpcomingMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [previousMatches, setPreviousMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedSport, setSelectedSport] = useState('all');
  const [sports, setSports] = useState<string[]>([]);
  const [showPreviousMatches, setShowPreviousMatches] = useState(false);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const { data, error } = await supabase
          .from('modalities')
          .select('name')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        setSports(data.map(sport => sport.name));
      } catch (error) {
        console.error('Erro ao buscar modalidades:', error);
        toast.error('Erro ao carregar modalidades');
      }
    };

    const findNextMonthWithGames = async () => {
      try {
        // Buscar o próximo jogo agendado
        const { data, error } = await supabase
          .from('games')
          .select('date')
          .eq('status', 'scheduled')
          .gte('date', new Date().toISOString().split('T')[0])
          .order('date')
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          const nextGameDate = new Date(data[0].date);
          const nextMonth = `${nextGameDate.getFullYear()}-${String(nextGameDate.getMonth() + 1).padStart(2, '0')}`;
          setSelectedMonth(nextMonth);
        }
      } catch (error) {
        console.error('Erro ao buscar próximo mês com jogos:', error);
      }
    };

    fetchSports();
    findNextMonthWithGames();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const [year, month] = selectedMonth.split('-');
        const startDate = new Date(Number(year), Number(month) - 1, 1);
        const endDate = new Date(Number(year), Number(month), 0);

        // Buscar jogos futuros
        let upcomingQuery = supabase
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
          .eq('status', 'scheduled')
          .order('date')
          .order('time');

        // Buscar jogos anteriores
        let previousQuery = supabase
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
          .eq('status', 'finished')
          .order('date', { ascending: false })
          .order('time', { ascending: false });

        if (selectedSport !== 'all') {
          upcomingQuery = upcomingQuery.eq('sport', selectedSport);
          previousQuery = previousQuery.eq('sport', selectedSport);
        }

        const [upcomingRes, previousRes] = await Promise.all([
          upcomingQuery,
          previousQuery
        ]);

        if (upcomingRes.error) throw upcomingRes.error;
        if (previousRes.error) throw previousRes.error;

        const formatGames = (games: any[]) => games.map(game => ({
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
          highlights: game.highlights
        }));

        setMatches(formatGames(upcomingRes.data || []));
        setPreviousMatches(formatGames(previousRes.data || []));
      } catch (error) {
        console.error('Erro ao buscar jogos:', error);
        toast.error('Erro ao carregar jogos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [selectedMonth, selectedSport]);

  if (loading) {
    return (
      <div className="container mx-auto px-3 lg:px-6 py-4 md:py-8 lg:py-12">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 lg:px-6 py-4 md:py-8 lg:py-12">
      <div className="flex flex-col space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg md:text-2xl font-bold dark:text-white">
            {showPreviousMatches ? 'Resultados Anteriores' : 'Próximos Jogos'}
          </h2>
          <button
            onClick={() => setShowPreviousMatches(!showPreviousMatches)}
            className="px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-md transition-colors"
          >
            {showPreviousMatches ? 'Ver Próximos Jogos' : 'Ver Resultados Anteriores'}
          </button>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <div className="relative w-full md:w-48">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-8 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white"
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
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div className="relative w-full md:w-48">
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-8 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white"
            >
              <option value="all">Todas Modalidades</option>
              {sports.map(sport => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {showPreviousMatches ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {previousMatches.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Nenhum resultado encontrado para este período.</p>
            </div>
          ) : (
            previousMatches.map((match) => (
              <div
                key={match.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-t-4 border-green-500"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(`${match.date}T12:00:00`).toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Horário: {match.time} • Duração: {match.game_time || 'Não informado'}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {match.sport}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 text-center">
                        <p className="font-medium dark:text-white mb-2">{match.team_a_name}</p>
                        <span className={`text-2xl font-bold ${(match.score_a || 0) > (match.score_b || 0) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                          {match.score_a || 0}
                        </span>
                      </div>
                      <div className="mx-4 flex flex-col items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Final</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">X</span>
                      </div>
                      <div className="flex-1 text-center">
                        <p className="font-medium dark:text-white mb-2">{match.team_b_name}</p>
                        <span className={`text-2xl font-bold ${(match.score_b || 0) > (match.score_a || 0) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                          {match.score_b || 0}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span>{match.category}</span>
                        <span>{match.location}</span>
                      </div>
                      {match.highlights && (
                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-md">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Destaques:</span> {match.highlights}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Nenhum jogo encontrado para este período.</p>
            </div>
          ) : (
            matches.map((match) => (
              <div
                key={match.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(`${match.date}T12:00:00`).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })} às {match.time}
                    </span>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                      {match.sport}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium dark:text-white">{match.team_a_name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">VS</span>
                      <span className="font-medium dark:text-white">{match.team_b_name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{match.category}</span>
                      <span>{match.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UpcomingMatches;