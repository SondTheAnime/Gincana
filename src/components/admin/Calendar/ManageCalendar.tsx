import { useState, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
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
  team_a_score: number;
  team_b_score: number;
}

const ManageCalendar = () => {
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [groupedMatches, setGroupedMatches] = useState<Record<string, Match[]>>({});

  useEffect(() => {
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
        const formattedData = gamesData?.map(game => {
          return {
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
            team_a_score: game.score_a || 0,
            team_b_score: game.score_b || 0
          };
        }) || [];

        // Agrupar jogos por data
        const groupedGames = formattedData.reduce((acc, match) => {
          if (!acc[match.date]) {
            acc[match.date] = [];
          }
          acc[match.date].push(match);
          return acc;
        }, {} as Record<string, typeof formattedData>);

        setGroupedMatches(groupedGames);
      } catch (error) {
        console.error('Erro ao buscar jogos:', error);
        toast.error('Erro ao carregar jogos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [selectedMonth]);

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
                          </div>
                          <div className="mt-2 text-sm md:text-base">
                            <span className="font-medium">{match.team_a_name}</span>
                            <span className="mx-2 text-gray-400">vs</span>
                            <span className="font-medium">{match.team_b_name}</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {match.location}
                          </div>
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
    </div>
  );
};

export default ManageCalendar; 