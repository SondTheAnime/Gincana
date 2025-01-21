import { useState, useEffect } from 'react';
import { Activity, Filter } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-toastify';
import { Game } from './types';
import { VolleyGame } from './components/VolleyGame/VolleyGame';
import type { TableTennisGame } from '../../admin/Score/modalities/table-tennis/types';
import TableTennisLiveGame from './components/TableTennis/TableTennisLiveGame'

const LiveGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState('all');
  const [sports, setSports] = useState<string[]>([]);
  const [_selectedGameId, setSelectedGameId] = useState<number | null>(null);

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
            highlights,
            game_configs (
              id,
              total_sets,
              points_per_set,
              points_last_set,
              min_difference,
              max_timeouts,
              max_substitutions,
              created_at,
              updated_at
            ),
            volleyball_game_details (
              current_set,
              points_a,
              points_b,
              timeouts_a,
              timeouts_b
            ),
            table_tennis_game_details (
              current_set,
              points_a,
              points_b,
              serves_left,
              server
            ),
            game_sets (
              set_number,
              score_a,
              score_b,
              winner,
              status
            )
          `)
          .eq('status', 'live')
          .order('date')
          .order('time');

        if (selectedSport !== 'all') {
          query = query.eq('sport', selectedSport);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Parse dos highlights e organiza os dados específicos de cada modalidade
        const gamesWithParsedData = (data || []).map(game => {
        // Parse dos highlights
          const highlights = (game.highlights || []).map((highlight: string | any) => {
            try {
              return typeof highlight === 'string' ? JSON.parse(highlight) : highlight;
            } catch (e) {
              console.error('Erro ao fazer parse do highlight:', e);
              return null;
            }
          }).filter(Boolean);

          // Organiza os sets em ordem
          const sets = game.game_sets?.sort((a: any, b: any) => a.set_number - b.set_number).map(set => ({
            number: set.set_number,
            score_a: set.score_a,
            score_b: set.score_b,
            winner: set.winner as 'A' | 'B' | undefined,
            status: set.status as 'not_started' | 'in_progress' | 'finished'
          })) || [];

          // Dados específicos baseados no esporte
          let specificData = null;
          if (game.sport === 'Vôlei') {
            const volleyballDetails = game.volleyball_game_details?.[0] || {
              current_set: 1,
              points_a: 0,
              points_b: 0,
              timeouts_a: 0,
              timeouts_b: 0
            };

            const totalSets = game.game_configs?.[0]?.total_sets || 5;
            const defaultSets = Array.from({ length: totalSets }, (_, i) => ({
              number: i + 1,
              score_a: 0,
              score_b: 0,
              status: i === 0 ? 'in_progress' as const : 'not_started' as const
            }));

            specificData = {
              volleyball_data: {
                ...volleyballDetails,
                sets: sets.length > 0 ? sets : defaultSets
              }
            };
          } else if (game.sport === 'Tênis de Mesa') {
            const tableTennisDetails = game.table_tennis_game_details?.[0] || {
              current_set: 1,
              points_a: 0,
              points_b: 0,
              serves_left: 2,
              server: 'A' as const
            };

            const totalSets = game.game_configs?.[0]?.total_sets || 5;
            const defaultSets = Array.from({ length: totalSets }, (_, i) => ({
              number: i + 1,
              score_a: 0,
              score_b: 0,
              status: i === 0 ? 'in_progress' as const : 'not_started' as const
            }));

            specificData = {
              table_tennis_data: {
                ...tableTennisDetails,
                sets: sets.length > 0 ? sets : defaultSets
              }
            };
          }

          return {
            ...game,
            highlights,
            config: game.game_configs?.[0] ? {
              ...game.game_configs[0],
              game_id: game.id
            } : {
              id: 0,
              game_id: game.id,
              total_sets: 0,
              points_per_set: 0,
              min_difference: 2,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            ...specificData,
            // Remove os dados brutos da query
            game_configs: undefined,
            volleyball_game_details: undefined,
            table_tennis_game_details: undefined,
            game_sets: undefined
          };
        });

        setGames(gamesWithParsedData);
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
        async (payload: any) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            // Buscar dados completos do jogo
            const { data: gameData, error } = await supabase
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
                highlights,
                game_configs (
                  id,
                  total_sets,
                  points_per_set,
                  points_last_set,
                  min_difference,
                  max_timeouts,
                  max_substitutions,
                  created_at,
                  updated_at
                ),
                volleyball_game_details (
                  current_set,
                  points_a,
                  points_b,
                  timeouts_a,
                  timeouts_b
                ),
                table_tennis_game_details (
                  current_set,
                  points_a,
                  points_b,
                  serves_left,
                  server
                ),
                game_sets (
                  set_number,
                  score_a,
                  score_b,
                  winner,
                  status
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (error) {
              console.error('Erro ao buscar detalhes do jogo:', error);
              return;
            }

            // Parse dos highlights
            const highlights = (gameData.highlights || []).map((highlight: string | any) => {
                try {
                  return typeof highlight === 'string' ? JSON.parse(highlight) : highlight;
                } catch (e) {
                  console.error('Erro ao fazer parse do highlight:', e);
                  return null;
                }
              }).filter(Boolean);

            // Organiza os sets em ordem
            const sets = gameData.game_sets?.sort((a: any, b: any) => a.set_number - b.set_number).map(set => ({
              number: set.set_number,
              score_a: set.score_a,
              score_b: set.score_b,
              winner: set.winner,
              status: set.status
            })) || [];

            // Dados específicos baseados no esporte
            let specificData = null;
            if (gameData.sport === 'Vôlei' && gameData.volleyball_game_details?.[0]) {
              specificData = {
                volleyball_data: {
                  ...gameData.volleyball_game_details[0],
                  sets
                }
              };
            } else if (gameData.sport === 'Tênis de Mesa' && gameData.table_tennis_game_details?.[0]) {
              specificData = {
                table_tennis_data: {
                  ...gameData.table_tennis_game_details[0],
                  sets
                }
              };
            }

            const newGame = {
              ...gameData,
              highlights,
              config: gameData.game_configs?.[0] ? {
                ...gameData.game_configs[0],
                game_id: gameData.id
              } : {
                id: 0,
                game_id: gameData.id,
                total_sets: 0,
                points_per_set: 0,
                min_difference: 2,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              ...specificData,
              // Remove os dados brutos da query
              game_configs: undefined,
              volleyball_game_details: undefined,
              table_tennis_game_details: undefined,
              game_sets: undefined
            };

            setGames(current => {
              const index = current.findIndex(game => game.id === payload.new.id);
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

  const renderGame = (game: Game) => {
    switch (game.sport) {
      case 'Vôlei':
        return (
          <VolleyGame
            key={game.id}
            game={game}
            onClick={() => setSelectedGameId(game.id)}
          />
        );
      case 'Tênis de Mesa':
        return (
          <TableTennisLiveGame game={game as unknown as TableTennisGame} />
        );
    }
  };

  return (
    <div className="container mx-auto px-3 lg:px-6 py-4 md:py-8 lg:py-12">
      <div className="flex flex-col space-y-3 mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Jogos Ao Vivo
          </h2>
          <div className='relative flex items-center'>
            <div className='w-3 h-3 bg-red-500 rounded-full animate-ping'></div>
            <div className='w-3 h-3 bg-red-500 rounded-full absolute'></div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="text-sm text-gray-300 bg-gray-800 border border-gray-700 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Todas Modalidades</option>
            {sports.map((sport) => (
              <option key={sport} value={sport}>
          {sport}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Nenhum jogo ao vivo no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div key={game.id} className="w-full">
              {game.sport === 'Tênis de Mesa' ? (
                <TableTennisLiveGame game={game as unknown as TableTennisGame} />
              ) : (
                <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                  {renderGame(game)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveGames;
