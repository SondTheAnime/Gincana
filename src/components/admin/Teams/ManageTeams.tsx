import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { Team, Player, Award, SportType, CategoryType } from './types';
import TeamsList from './TeamsList';
import TeamDetails from './TeamDetails';
import TeamModals from './TeamModals';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-toastify';

interface ManageTeamsProps {
  modalityFilter?: string;
}

const ManageTeams = ({ modalityFilter }: ManageTeamsProps) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Record<number, Player[]>>({});
  const [awards, setAwards] = useState<Record<number, Award[]>>({});
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [isEditingPlayer, setIsEditingPlayer] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  const [newTeam, setNewTeam] = useState({
    name: '',
    category: 'Masculino' as CategoryType,
    modality: modalityFilter || 'Futebol' as SportType
  });

  const [newAwardTitle, setNewAwardTitle] = useState('');

  const [newPlayer, setNewPlayer] = useState({
    name: '',
    number: '',
    photo: undefined as string | undefined,
    goals: 0,
    yellow_cards: 0,
    red_cards: 0
  });

  useEffect(() => {
    fetchTeams();

    // Inscrever para atualizações em tempo real
    const subscription = supabase
      .channel('teams_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'teams' },
        () => fetchTeams()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [modalityFilter]);

  const fetchTeams = async () => {
    try {
      let query = supabase
        .from('teams')
        .select('*')
        .order('name');

      if (modalityFilter) {
        query = query.eq('modality', modalityFilter);
      }

      const { data: teamsData, error: teamsError } = await query;

      if (teamsError) throw teamsError;

      setTeams(teamsData);

      // Buscar jogadores e premiações para cada time
      for (const team of teamsData) {
        fetchTeamPlayers(team.id);
        fetchTeamAwards(team.id);
      }
    } catch (error) {
      console.error('Erro ao buscar times:', error);
      toast.error('Erro ao carregar times. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamPlayers = async (teamId: number) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('team_id', teamId)
        .order('number');

      if (error) throw error;

      setPlayers(prev => ({ ...prev, [teamId]: data }));
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error);
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

      setAwards(prev => ({ ...prev, [teamId]: data }));
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
          modality: newTeam.modality
        }])
        .select()
        .single();

      if (error) throw error;

      setTeams([...teams, data]);
      setNewTeam({ name: '', category: 'Masculino', modality: 'Futebol' });
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
          goals: newPlayer.goals,
          yellow_cards: newPlayer.yellow_cards,
          red_cards: newPlayer.red_cards
        }])
        .select()
        .single();

      if (error) throw error;

      setPlayers(prev => ({
        ...prev,
        [selectedTeam.id]: [...(prev[selectedTeam.id] || []), data]
      }));
      
      setNewPlayer({ name: '', number: '', photo: undefined, goals: 0, yellow_cards: 0, red_cards: 0 });
      setIsAddingPlayer(false);
      toast.success('Jogador adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar jogador:', error);
      toast.error('Erro ao adicionar jogador. Tente novamente.');
    }
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setIsEditingPlayer(true);
  };

  const handleUpdatePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer || !selectedTeam) return;
  
    try {
      const { error } = await supabase
        .from('players')
        .update({
          name: editingPlayer.name,
          number: editingPlayer.number,
          photo: editingPlayer.photo,
          goals: editingPlayer.goals,
          yellow_cards: editingPlayer.yellow_cards,
          red_cards: editingPlayer.red_cards
        })
        .eq('id', editingPlayer.id);
  
      if (error) throw error;
  
      // Atualizar o estado local imediatamente
      setPlayers(prev => ({
        ...prev,
        [selectedTeam.id]: prev[selectedTeam.id].map(player =>
          player.id === editingPlayer.id ? editingPlayer : player
        )
      }));
  
      setIsEditingPlayer(false);
      setEditingPlayer(null);
      toast.success('Jogador atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar jogador:', error);
      toast.error('Erro ao atualizar jogador. Tente novamente.');
    }
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setIsEditingTeam(true);
  };

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;

    try {
      const { error } = await supabase
        .from('teams')
        .update({
          name: editingTeam.name,
          category: editingTeam.category,
          modality: editingTeam.modality
        })
        .eq('id', editingTeam.id);

      if (error) throw error;

      await fetchTeams();
      setIsEditingTeam(false);
      setEditingTeam(null);
      toast.success('Time atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar time:', error);
      toast.error('Erro ao atualizar time. Tente novamente.');
    }
  };

  const handleAddAward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;

    try {
      const { error } = await supabase
        .from('awards')
        .insert([{
          team_id: editingTeam.id,
          title: newAwardTitle,
          date: new Date().toISOString()
        }]);

      if (error) throw error;

      await fetchTeamAwards(editingTeam.id);
      toast.success('Premiação adicionada com sucesso!');
      setNewAwardTitle('');
    } catch (error) {
      console.error('Erro ao adicionar premiação:', error);
      toast.error('Erro ao adicionar premiação. Tente novamente.');
    }
  };

  const handleRemoveAward = async (awardId: number) => {
    if (!editingTeam) return;

    try {
      const { error } = await supabase
        .from('awards')
        .delete()
        .eq('id', awardId);

      if (error) throw error;

      await fetchTeamAwards(editingTeam.id);
      toast.success('Premiação removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover premiação:', error);
      toast.error('Erro ao remover premiação. Tente novamente.');
    }
  };

  const handleToggleStarter = async (playerId: number) => {
    try {
      const player = players.find(p => p.id === playerId)
      if (!player) return

      const { error } = await supabase
        .from('players')
        .update({ is_starter: !player.is_starter })
        .eq('id', playerId)

      if (error) throw error

      setPlayers(prev =>
        prev.map(p =>
          p.id === playerId ? { ...p, is_starter: !p.is_starter } : p
        )
      )

      toast.success(
        player.is_starter
          ? 'Jogador removido do time titular'
          : 'Jogador adicionado ao time titular'
      )
    } catch (error) {
      console.error('Erro ao alterar titular:', error)
      toast.error('Erro ao alterar titular')
    }
  }

  const handleToggleCaptain = async (playerId: number) => {
    try {
      const player = players.find(p => p.id === playerId)
      if (!player) return

      const { error } = await supabase
        .from('players')
        .update({ is_captain: !player.is_captain })
        .eq('id', playerId)

      if (error) throw error

      setPlayers(prev =>
        prev.map(p =>
          p.id === playerId ? { ...p, is_captain: !p.is_captain } : p
        )
      )

      toast.success(
        player.is_captain
          ? 'Jogador removido da capitania'
          : 'Jogador definido como capitão'
      )
    } catch (error) {
      console.error('Erro ao alterar capitão:', error)
      toast.error('Erro ao alterar capitão')
    }
  }

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
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {modalityFilter ? `Times de ${modalityFilter}` : 'Gerenciar Times'}
        </h2>
        <button
          onClick={handleAddTeam}
          className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-md transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          <Users className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Adicionar Time</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <TeamsList
          teams={teams}
          selectedTeam={selectedTeam}
          onSelectTeam={setSelectedTeam}
          onEditTeam={handleEditTeam}
          awards={awards}
        />
        
        <div className="lg:col-span-2">
          {selectedTeam ? (
            <TeamDetails
              team={selectedTeam}
              players={players}
              setPlayers={setPlayers}
              onToggleCaptain={handleToggleCaptain}
              onToggleStarter={handleToggleStarter}
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Selecione um time para ver os detalhes
              </p>
            </div>
          )}
        </div>
      </div>

      <TeamModals
        isAddingTeam={isAddingTeam}
        isAddingPlayer={isAddingPlayer}
        isEditingPlayer={isEditingPlayer}
        isEditingTeam={isEditingTeam}
        editingPlayer={editingPlayer}
        editingTeam={editingTeam}
        newTeam={newTeam}
        newPlayer={newPlayer}
        awards={editingTeam ? awards[editingTeam.id] || [] : []}
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
        onUpdatePlayer={handleUpdatePlayer}
        onUpdateTeam={handleUpdateTeam}
        onChangeNewTeam={(field, value) => setNewTeam({ ...newTeam, [field]: value })}
        onChangeNewPlayer={(field, value) => setNewPlayer({ ...newPlayer, [field]: value as string })}
        onChangeEditingPlayer={(field, value) => editingPlayer && setEditingPlayer({ ...editingPlayer, [field]: value })}
        onChangeEditingTeam={(field, value) => editingTeam && setEditingTeam({ ...editingTeam, [field]: value })}
        onAddAward={handleAddAward}
        onRemoveAward={handleRemoveAward}
      />
    </div>
  );
};

export default ManageTeams; 