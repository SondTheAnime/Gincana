import { useState, useEffect } from 'react';
import { Activity, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';

interface GameEvent {
  created_at: string;
  player_id: number;
  team: 'A' | 'B';
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
}

interface Game {
  id: number;
  sport: string;
  team_a: number;
  team_b: number;
  team_a_name: string;
  team_b_name: string;
  score_a: number;
  score_b: number;
  date: string;
  time: string;
  game_time: string;
  period: string;
  location: string;
  category: string;
  status: 'scheduled' | 'live' | 'finished' | 'cancelled';
  highlights?: GameEvent[];
}

const LiveGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState('all');
  const [sports, setSports] = useState<string[]>([]);
  const [players, setPlayers] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data, error } = await supabase
          .from('players')
          .select('id, name');

        if (error) throw error;

        const playersMap = (data || []).reduce((acc, player) => {
          acc[player.id] = player.name;
          return acc;
        }, {} as Record<number, string>);

        setPlayers(playersMap);
      } catch (error) {
        console.error('Erro ao buscar jogadores:', error);
        toast.error('Erro ao carregar jogadores');
      }
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        let query = supabase
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
            team_a_name,
            team_b_name,
            highlights
          `)
          .eq('status', 'live')
          .order('date')
          .order('time');

        if (selectedSport !== 'all') {
          query = query.eq('sport', selectedSport);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Parse dos highlights
        const gamesWithParsedHighlights = (data || []).map(game => ({
          ...game,
          highlights: (game.highlights || []).map((highlight: string | GameEvent) => {
            try {
              return typeof highlight === 'string' ? JSON.parse(highlight) : highlight;
            } catch (e) {
              console.error('Erro ao fazer parse do highlight:', e);
              return null;
            }
          }).filter(Boolean)
        }));

        setGames(gamesWithParsedHighlights);
      } catch (error) {
        console.error('Erro ao buscar jogos:', error);
        toast.error('Erro ao carregar jogos');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();

    // Inscrever para atualizações em tempo real
    const subscription = supabase
      .channel('live_games')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `status=eq.live${selectedSport !== 'all' ? ` AND sport=eq.${selectedSport}` : ''}`
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setGames(current => {
              const index = current.findIndex(game => game.id === payload.new.id);
              const highlights = (payload.new.highlights || []).map((highlight: string | GameEvent) => {
                try {
                  return typeof highlight === 'string' ? JSON.parse(highlight) : highlight;
                } catch (e) {
                  console.error('Erro ao fazer parse do highlight:', e);
                  return null;
                }
              }).filter(Boolean);

              const newGame = {
                ...payload.new,
                team_a_name: payload.new.team_a_name || 'Time não encontrado',
                team_b_name: payload.new.team_b_name || 'Time não encontrado',
                highlights
              };
              
              if (index >= 0) {
                return [
                  ...current.slice(0, index),
                  newGame,
                  ...current.slice(index + 1)
                ];
              }
              return [...current, newGame];
            });
          } else if (payload.eventType === 'DELETE') {
            setGames(current => current.filter(game => game.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedSport]);

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

  if (loading) {
    return (
      <div className="container mx-auto px-3 lg:px-6 py-4 md:py-8 lg:py-12">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 lg:px-6 py-4 md:py-8 lg:py-12">
      <div className="flex flex-col space-y-3 mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="h-5 w-5 md:h-6 md:w-6 text-red-500" />
          <h2 className="text-lg md:text-2xl font-bold dark:text-white">Jogos Ao Vivo</h2>
          <span className="animate-pulse flex items-center ml-2">
            <span className="h-2 w-2 md:h-3 md:w-3 bg-red-500 rounded-full mr-1"></span>
            <span className="text-xs md:text-sm font-medium text-red-500">AO VIVO</span>
          </span>
        </div>
        <div className="relative w-full md:w-64">
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-8 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
          >
            <option value="all">Todas Modalidades</option>
            {sports.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
          <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {games.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Nenhum jogo ao vivo no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {game.game_time} - {game.period}
                  </span>
                  <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                    {game.sport}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium dark:text-white">{game.team_a_name}</p>
                    </div>
                    <div className="px-4">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {game.score_a} - {game.score_b}
                      </span>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="font-medium dark:text-white">{game.team_b_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{game.category}</span>
                    <span>{game.location}</span>
                  </div>
                  {(game.highlights?.length ?? 0) > 0 && (
                    <div className="mt-2 space-y-1 border-t border-gray-200 dark:border-gray-700 pt-2">
                      {game.highlights?.map((event: GameEvent, index: number) => (
                        <div key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                          <span>{new Date(event.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                          <span>-</span>
                          <span>
                            {event.type === 'goal' && `⚽ Gol - ${players[event.player_id] || 'Jogador não encontrado'}`}
                            {event.type === 'yellow_card' && `🟨 Cartão Amarelo - ${players[event.player_id] || 'Jogador não encontrado'}`}
                            {event.type === 'red_card' && `🟥 Cartão Vermelho - ${players[event.player_id] || 'Jogador não encontrado'}`}
                            {event.type === 'substitution' && `🔄 Substituição - ${players[event.player_id] || 'Jogador não encontrado'}`}
                          </span>
                          <span>-</span>
                          <span>{event.team === 'A' ? game.team_a_name : game.team_b_name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveGames;
