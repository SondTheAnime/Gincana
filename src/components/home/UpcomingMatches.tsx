import { useState, useEffect } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
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
}

const UpcomingMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('2024-03');
  const [selectedSport, setSelectedSport] = useState('all');
  const [sports, setSports] = useState<string[]>([]);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const { data, error } = await supabase
          .from('modalities')
          .select('name')
          .eq('is_team_sport', true)
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        setSports(data.map(sport => sport.name));
      } catch (error) {
        console.error('Erro ao buscar modalidades:', error);
        toast.error('Erro ao carregar modalidades');
      }
    };

    fetchSports();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const startDate = `${selectedMonth}-01`;
        const endDate = `${selectedMonth}-31`;

        let query = supabase
          .from('games')
          .select(`
            *,
            team_a_name:teams!games_team_a_fkey(name),
            team_b_name:teams!games_team_b_fkey(name)
          `)
          .gte('date', startDate)
          .lte('date', endDate)
          .eq('status', 'scheduled')
          .order('date')
          .order('time');

        if (selectedSport !== 'all') {
          query = query.eq('sport', selectedSport);
        }

        const { data, error } = await query;

        if (error) throw error;
        setMatches(data || []);
      } catch (error) {
        console.error('Erro ao buscar jogos:', error);
        toast.error('Erro ao carregar jogos');
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
        <h2 className="text-lg md:text-2xl font-bold dark:text-white">Próximos Jogos</h2>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <div className="relative w-full md:w-48">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-8 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white"
            >
              <option value="2024-03">Março 2024</option>
              <option value="2024-04">Abril 2024</option>
              <option value="2024-05">Maio 2024</option>
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

      {matches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Nenhum jogo encontrado para este período.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(match.date).toLocaleDateString('pt-BR')} às {match.time}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingMatches;