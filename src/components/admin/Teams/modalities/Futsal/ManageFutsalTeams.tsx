import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { FutsalTeam, FutsalPlayer } from '../../types';
import FutsalTeamsList from './FutsalTeamsList';
import FutsalTeamDetails from './FutsalTeamDetails';
import FutsalTeamModals from './FutsalTeamModals';
import { supabase } from '../../../../../lib/supabase';
import { toast } from 'react-toastify';

const POSITIONS = ['Goleiro', 'Fixo', 'Ala Direita', 'Ala Esquerda', 'Pivô'] as const;
const FORMATIONS = ['1-2-1', '2-2', '3-1', '4-0'] as const;

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

  const [newTeam, setNewTeam] = useState<Partial<FutsalTeam>>({
    name: '',
    category: 'Masculino',
    modality: 'Futsal',
    coach: '',
    assistant_coach: '',
    home_court: '',
    formation: '1-2-1'
  });

  const [newPlayer, setNewPlayer] = useState<Partial<FutsalPlayer>>({
    name: '',
    number: 0,
    position: 'Goleiro',
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

  useEffect(() => {
    fetchTeams();

    // Criar os channels
    const teamsChannel = supabase.channel('teams_changes');
    const playersChannel = supabase.channel('players_changes');

    // Configurar as subscriptions
    teamsChannel
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'teams' },
        () => fetchTeams()
      )
      .subscribe();

    playersChannel
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players' },
        () => fetchTeams()
      )
      .subscribe();

    // Cleanup function
    return () => {
      // Remover as subscriptions e channels
      supabase.removeChannel(teamsChannel);
      supabase.removeChannel(playersChannel);
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

      const futsalTeams: FutsalTeam[] = teamsData.map((team: any) => ({
        ...team,
        players: (team.players || []).map((player: any) => ({
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
    } catch (error) {
      console.error('Erro ao buscar times:', error);
      toast.error('Erro ao carregar times. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeam = () => {
    setIsAddingTeam(true);
  };

  const handleAddPlayer = () => {
    setIsAddingPlayer(true);
  };

  const handleEditTeam = (team: FutsalTeam) => {
    setEditingTeam(team);
    setIsEditingTeam(true);
  };

  const handleEditPlayer = (player: FutsalPlayer) => {
    setEditingPlayer(player);
    setIsEditingPlayer(true);
  };

  const handleSubmitTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{
          name: newTeam.name,
          category: newTeam.category,
          modality: 'Futsal',
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
        formation: '1-2-1'
      });
      setIsAddingTeam(false);
      toast.success('Time adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar time:', error);
      toast.error('Erro ao adicionar time. Tente novamente.');
    }
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
          coach: editingTeam.coach,
          assistant_coach: editingTeam.assistant_coach,
          home_court: editingTeam.home_court,
          formation: editingTeam.formation
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

  const handleSubmitPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !newPlayer.name || !newPlayer.position) return;

    try {
      const { data, error } = await supabase
        .from('players')
        .insert([{
          name: newPlayer.name,
          number: newPlayer.number,
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
        number: 0,
        position: 'Goleiro',
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

  const handleUpdatePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer || !selectedTeam) return;

    try {
      // Garantir que todas as estatísticas estejam presentes no objeto
      const stats = {
        goals: editingPlayer.stats.goals || 0,
        assists: editingPlayer.stats.assists || 0,
        saves: editingPlayer.stats.saves || 0,
        clean_sheets: editingPlayer.stats.clean_sheets || 0,
        minutes_played: editingPlayer.stats.minutes_played || 0,
        fouls_committed: editingPlayer.stats.fouls_committed || 0,
        fouls_suffered: editingPlayer.stats.fouls_suffered || 0,
        yellow_cards: editingPlayer.stats.yellow_cards || 0,
        red_cards: editingPlayer.stats.red_cards || 0
      };

      const { error } = await supabase
        .from('players')
        .update({
          name: editingPlayer.name,
          number: editingPlayer.number,
          photo: editingPlayer.photo,
          position: editingPlayer.position,
          stats: stats // Enviar o objeto stats completo
        })
        .eq('id', editingPlayer.id);

      if (error) throw error;

      // Atualizar estado local com as novas estatísticas
      const updatedTeams = teams.map(team => ({
        ...team,
        players: team.players.map(p => 
          p.id === editingPlayer.id 
            ? { ...editingPlayer, stats: stats }
            : p
        )
      }));
      
      setTeams(updatedTeams);
      
      // Atualizar selectedTeam se necessário
      if (selectedTeam) {
        const updatedSelectedTeam = updatedTeams.find(t => t.id === selectedTeam.id);
        if (updatedSelectedTeam) {
          setSelectedTeam(updatedSelectedTeam);
        }
      }

      setIsEditingPlayer(false);
      setEditingPlayer(null);
      toast.success('Jogador atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar jogador:', error);
      toast.error('Erro ao atualizar jogador. Tente novamente.');
    }
  };

  const handleToggleStarter = async (player: FutsalPlayer) => {
    try {
      const { error } = await supabase
        .from('players')
        .update({ is_starter: !player.is_starter })
        .eq('id', player.id);

      if (error) throw error;

      // Atualizar o estado dos times
      const updatedTeams = teams.map(team =>
        team.id === player.team_id
          ? {
              ...team,
              players: team.players.map(p =>
                p.id === player.id
                  ? { ...p, is_starter: !p.is_starter }
                  : p
              )
            }
          : team
      );

      setTeams(updatedTeams);
      
      // Atualizar o time selecionado
      if (selectedTeam && selectedTeam.id === player.team_id) {
        setSelectedTeam(updatedTeams.find(team => team.id === player.team_id) || null);
      }

      toast.success(`${player.name} ${!player.is_starter ? 'definido como titular' : 'movido para reserva'}`);
    } catch (error) {
      console.error('Erro ao atualizar status do jogador:', error);
      toast.error('Erro ao atualizar status do jogador');
    }
  };

  const handleToggleCaptain = async (player: FutsalPlayer) => {
    try {
      if (!player.is_captain && selectedTeam) {
        const currentCaptain = selectedTeam.players.find(p => p.is_captain);
        if (currentCaptain) {
          await supabase
            .from('players')
            .update({ is_captain: false })
            .eq('id', currentCaptain.id);
        }
      }

      const { error } = await supabase
        .from('players')
        .update({ is_captain: !player.is_captain })
        .eq('id', player.id);

      if (error) throw error;

      // Atualizar o estado dos times
      const updatedTeams = teams.map(team =>
        team.id === player.team_id
          ? {
              ...team,
              players: team.players.map(p =>
                p.id === player.id
                  ? { ...p, is_captain: !p.is_captain }
                  : { ...p, is_captain: false }
              )
            }
          : team
      );

      setTeams(updatedTeams);
      
      // Atualizar o time selecionado
      if (selectedTeam && selectedTeam.id === player.team_id) {
        setSelectedTeam(updatedTeams.find(team => team.id === player.team_id) || null);
      }

      toast.success(`${player.name} ${!player.is_captain ? 'definido como capitão' : 'removido da capitania'}`);
    } catch (error) {
      console.error('Erro ao atualizar capitão:', error);
      toast.error('Erro ao atualizar capitão');
    }
  };

  const handleDeleteTeam = async (teamId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este time? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (error) throw error;

      // Atualizar estado local
      const updatedTeams = teams.filter(team => team.id !== teamId);
      setTeams(updatedTeams);
      
      // Se o time excluído for o selecionado, limpar a seleção
      if (selectedTeam?.id === teamId) {
        setSelectedTeam(null);
      }

      setIsEditingTeam(false);
      setEditingTeam(null);
      toast.success('Time excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir time:', error);
      toast.error('Erro ao excluir time. Tente novamente.');
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
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Times de Futsal
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
        <FutsalTeamsList
          teams={teams}
          selectedTeam={selectedTeam}
          onSelectTeam={setSelectedTeam}
          onEditTeam={handleEditTeam}
        />
        
        <FutsalTeamDetails
          selectedTeam={selectedTeam}
          onAddPlayer={handleAddPlayer}
          onEditPlayer={handleEditPlayer}
          onToggleStarter={handleToggleStarter}
          onToggleCaptain={handleToggleCaptain}
          players={selectedTeam?.players || []}
          setPlayers={(newPlayers) => {
            if (selectedTeam) {
              setTeams(prevTeams =>
                prevTeams.map(team =>
                  team.id === selectedTeam.id
                    ? { ...team, players: newPlayers }
                    : team
                )
              );
              setSelectedTeam({ ...selectedTeam, players: newPlayers });
            }
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
        onChangeNewPlayer={(field, value) => setNewPlayer({ ...newPlayer, [field]: value })}
        onChangeEditingPlayer={(field, value) => editingPlayer && setEditingPlayer({ ...editingPlayer, [field]: value })}
        onChangeEditingTeam={(field, value) => editingTeam && setEditingTeam({ ...editingTeam, [field]: value })}
        positions={POSITIONS}
        formations={FORMATIONS}
        onDeleteTeam={handleDeleteTeam}
      />
    </div>
  );
};

export default ManageFutsalTeams;