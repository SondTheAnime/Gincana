import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { FutsalTeam, FutsalPlayer, Award } from './types';
import FutsalTeamsList from './FutsalTeamsList';
import FutsalTeamDetails from './FutsalTeamDetails';
import FutsalTeamModals from './FutsalTeamModals';
import { supabase } from '../../../../../lib/supabase';
import { toast } from 'react-toastify';

const POSITIONS = ['Goleiro', 'Fixo', 'Ala Direita', 'Ala Esquerda', 'Pivô'] as const;
const FORMATIONS = ['3-1', '2-2', '4-0', '1-2-1'] as const;

const ManageFutsalTeams = () => {
  const [teams, setTeams] = useState<FutsalTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<FutsalTeam | null>(null);
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [isEditingPlayer, setIsEditingPlayer] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<FutsalPlayer | null>(null);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editingTeam, setEditingTeam] = useState<FutsalTeam | null>(null);
  const [loading, setLoading] = useState(true);

  const [newTeam, setNewTeam] = useState({
    name: '',
    category: 'Masculino' as const,
    modality: 'Futsal',
    coach: '',
    assistant_coach: '',
    home_court: '',
    formation: '3-1' as typeof FORMATIONS[number]
  });

  const [newPlayer, setNewPlayer] = useState({
    name: '',
    number: '',
    position: 'Fixo' as typeof POSITIONS[number],
    photo: undefined as string | undefined,
    stats: {
      goals: 0,
      assists: 0,
      saves: 0,
      clean_sheets: 0,
      minutes_played: 0,
      fouls_committed: 0,
      fouls_suffered: 0,
      yellow_cards: 0,
      red_cards: 0
    }
  });

  useEffect(() => {
    fetchTeams();

    const subscription = supabase
      .channel('futsal_teams_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'teams' },
        () => fetchTeams()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchTeams = async () => {
    try {
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*, players(*)')
        .eq('modality', 'Futsal')
        .order('name');

      if (teamsError) throw teamsError;

      const futsalTeams = teamsData.map(team => ({
        ...team,
        players: (team.players || []).map(player => ({
          ...player,
          stats: {
            goals: player.stats?.goals || 0,
            assists: player.stats?.assists || 0,
            saves: player.stats?.saves || 0,
            clean_sheets: player.stats?.clean_sheets || 0,
            minutes_played: player.stats?.minutes_played || 0,
            fouls_committed: player.stats?.fouls_committed || 0,
            fouls_suffered: player.stats?.fouls_suffered || 0,
            yellow_cards: player.stats?.yellow_cards || 0,
            red_cards: player.stats?.red_cards || 0
          }
        }))
      })) as FutsalTeam[];

      setTeams(futsalTeams);

      // Buscar premiações para cada time
      for (const team of futsalTeams) {
        fetchTeamAwards(team.id);
      }
    } catch (error) {
      console.error('Erro ao buscar times:', error);
      toast.error('Erro ao carregar times. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamAwards = async (teamId: number) => {
    try {
      const { data, error } = await supabase
        .from('awards')
        .select('*')
        .eq('team_id', teamId)
        .order('date', { ascending: false });

      if (error) throw error;

      // Atualizar o time com as premiações
      setTeams(prevTeams => 
        prevTeams.map(team => 
          team.id === teamId ? { ...team, awards: data } : team
        )
      );
    } catch (error) {
      console.error('Erro ao buscar premiações:', error);
    }
  };

  const handleAddTeam = () => {
    setIsAddingTeam(true);
  };

  const handleAddPlayer = () => {
    setIsAddingPlayer(true);
  };

  const handleSubmitTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{
          name: newTeam.name,
          category: newTeam.category,
          modality: newTeam.modality,
          coach: newTeam.coach,
          assistant_coach: newTeam.assistant_coach,
          home_court: newTeam.home_court,
          formation: newTeam.formation
        }])
        .select()
        .single();

      if (error) throw error;

      setTeams([...teams, { ...data, players: [] }]);
      setNewTeam({
        name: '',
        category: 'Masculino',
        modality: 'Futsal',
        coach: '',
        assistant_coach: '',
        home_court: '',
        formation: '3-1'
      });
      setIsAddingTeam(false);
      toast.success('Time adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar time:', error);
      toast.error('Erro ao adicionar time. Tente novamente.');
    }
  };

  const handleSubmitPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;

    try {
      const { data, error } = await supabase
        .from('players')
        .insert([{
          name: newPlayer.name,
          number: parseInt(newPlayer.number),
          team_id: selectedTeam.id,
          photo: newPlayer.photo,
          position: newPlayer.position,
          stats: newPlayer.stats
        }])
        .select()
        .single();

      if (error) throw error;

      setTeams(prevTeams =>
        prevTeams.map(team =>
          team.id === selectedTeam.id
            ? { ...team, players: [...team.players, data as FutsalPlayer] }
            : team
        )
      );

      setNewPlayer({
        name: '',
        number: '',
        position: 'Fixo',
        photo: undefined,
        stats: {
          goals: 0,
          assists: 0,
          saves: 0,
          clean_sheets: 0,
          minutes_played: 0,
          fouls_committed: 0,
          fouls_suffered: 0,
          yellow_cards: 0,
          red_cards: 0
        }
      });
      setIsAddingPlayer(false);
      toast.success('Jogador adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar jogador:', error);
      toast.error('Erro ao adicionar jogador. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Times de Futsal</h2>
        <button
          onClick={handleAddTeam}
          className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-md transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          <Users className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Adicionar Time</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <FutsalTeamsList
          teams={teams}
          selectedTeam={selectedTeam}
          onSelectTeam={setSelectedTeam}
          onEditTeam={(team) => {
            setEditingTeam(team);
            setIsEditingTeam(true);
          }}
        />
        
        <FutsalTeamDetails
          selectedTeam={selectedTeam}
          onAddPlayer={handleAddPlayer}
          onEditPlayer={(player) => {
            setEditingPlayer(player);
            setIsEditingPlayer(true);
          }}
        />
      </div>

      <FutsalTeamModals
        isAddingTeam={isAddingTeam}
        isAddingPlayer={isAddingPlayer}
        isEditingPlayer={isEditingPlayer}
        isEditingTeam={isEditingTeam}
        editingPlayer={editingPlayer}
        editingTeam={editingTeam}
        newTeam={newTeam}
        newPlayer={newPlayer}
        positions={POSITIONS}
        formations={FORMATIONS}
        onCloseAddTeam={() => setIsAddingTeam(false)}
        onCloseAddPlayer={() => setIsAddingPlayer(false)}
        onCloseEditPlayer={() => {
          setIsEditingPlayer(false);
          setEditingPlayer(null);
        }}
        onCloseEditTeam={() => {
          setIsEditingTeam(false);
          setEditingTeam(null);
        }}
        onSubmitTeam={handleSubmitTeam}
        onSubmitPlayer={handleSubmitPlayer}
        onChangeNewTeam={(field, value) => setNewTeam({ ...newTeam, [field]: value })}
        onChangeNewPlayer={(field, value) => {
          if (field.startsWith('stats.')) {
            const statField = field.split('.')[1];
            setNewPlayer({
              ...newPlayer,
              stats: { ...newPlayer.stats, [statField]: value }
            });
          } else {
            setNewPlayer({ ...newPlayer, [field]: value });
          }
        }}
      />
    </div>
  );
};

export default ManageFutsalTeams; 