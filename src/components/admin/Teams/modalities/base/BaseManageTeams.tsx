import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { supabase } from '../../../../../lib/supabase';
import { toast } from 'react-toastify';
import { BaseTeam, BasePlayer } from './types';

interface BaseManageTeamsProps<T extends BaseTeam, P extends BasePlayer> {
  modality: string;
  TeamsList: React.ComponentType<any>;
  TeamDetails: React.ComponentType<any>;
  TeamModals: React.ComponentType<any>;
  positions: readonly string[];
  formations: readonly string[];
  defaultPlayerStats: any;
  mapTeamData: (data: any) => T;
  mapPlayerData: (data: any) => P;
}

export function BaseManageTeams<T extends BaseTeam, P extends BasePlayer>({
  modality,
  TeamsList,
  TeamDetails,
  TeamModals,
  positions,
  formations,
  defaultPlayerStats,
  mapTeamData,
  mapPlayerData
}: BaseManageTeamsProps<T, P>) {
  const [teams, setTeams] = useState<T[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<T | null>(null);
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [isEditingPlayer, setIsEditingPlayer] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<P | null>(null);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editingTeam, setEditingTeam] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const [newTeam, setNewTeam] = useState<Partial<T>>({
    name: '',
    category: 'Masculino',
    modality,
    coach: '',
    assistant_coach: '',
    home_court: '',
    formation: formations[0]
  } as Partial<T>);

  const [newPlayer, setNewPlayer] = useState<Partial<P>>({
    name: '',
    number: 0,
    position: positions[0],
    photo: undefined,
    stats: defaultPlayerStats,
    style: '',
    grip: ''
  } as Partial<P>);

  useEffect(() => {
    fetchTeams();

    const teamsChannel = supabase.channel('teams_changes');
    const playersChannel = supabase.channel('players_changes');

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

    return () => {
      supabase.removeChannel(teamsChannel);
      supabase.removeChannel(playersChannel);
    };
  }, []);

  const fetchTeams = async () => {
    try {
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*, players(*)')
        .eq('modality', modality)
        .order('name');

      if (teamsError) throw teamsError;

      const mappedTeams = teamsData.map((team: any) => ({
        ...mapTeamData(team),
        players: (team.players || []).map((player: any) => mapPlayerData(player))
      }));

      setTeams(mappedTeams);
    } catch (error) {
      console.error('Erro ao buscar times:', error);
      toast.error('Erro ao carregar times. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Funções de manipulação básicas
  const handleAddTeam = () => setIsAddingTeam(true);
  const handleAddPlayer = () => setIsAddingPlayer(true);
  const handleEditTeam = (team: T) => {
    setEditingTeam(team);
    setIsEditingTeam(true);
  };
  const handleEditPlayer = (player: P) => {
    setEditingPlayer(player);
    setIsEditingPlayer(true);
  };

  // CRUD operations
  const handleSubmitTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{
          name: newTeam.name,
          category: newTeam.category,
          modality,
          coach: newTeam.coach,
          assistant_coach: newTeam.assistant_coach,
          home_court: newTeam.home_court,
          formation: newTeam.formation
        }])
        .select()
        .single();

      if (error) throw error;

      setTeams([...teams, mapTeamData({ ...data, players: [] })]);
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
          stats: newPlayer.stats,
          style: newPlayer.style,
          grip: newPlayer.grip
        }])
        .select()
        .single();

      if (error) throw error;

      setTeams(prevTeams => 
        prevTeams.map(team => 
          team.id === selectedTeam.id 
            ? { ...team, players: [...team.players, mapPlayerData(data)] }
            : team
        )
      );

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
      const { error } = await supabase
        .from('players')
        .update({
          name: editingPlayer.name,
          number: editingPlayer.number,
          photo: editingPlayer.photo,
          position: editingPlayer.position,
          stats: editingPlayer.stats,
          style: editingPlayer.style,
          grip: editingPlayer.grip
        })
        .eq('id', editingPlayer.id);

      if (error) throw error;

      // Update local state immediately
      setTeams(prevTeams =>
        prevTeams.map(team =>
          team.id === selectedTeam.id
            ? {
                ...team,
                players: team.players.map(p =>
                  p.id === editingPlayer.id ? editingPlayer : p
                )
              }
            : team
        )
      );

      setSelectedTeam({
        ...selectedTeam,
        players: selectedTeam.players.map(p =>
          p.id === editingPlayer.id ? editingPlayer : p
        )
      });

      setIsEditingPlayer(false);
      setEditingPlayer(null);
      toast.success('Jogador atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar jogador:', error);
      toast.error('Erro ao atualizar jogador. Tente novamente.');
      // Revert changes if there's an error
      await fetchTeams();
    }
  };

  const handleToggleStarter = async (player: P) => {
    try {
      const updatedPlayer = { ...player, is_starter: !player.is_starter };
      const { error } = await supabase
        .from('players')
        .update({ is_starter: !player.is_starter })
        .eq('id', player.id);

      if (error) throw error;

      // Update local state immediately
      setTeams(prevTeams =>
        prevTeams.map(team =>
          team.id === selectedTeam?.id
            ? {
                ...team,
                players: team.players.map(p =>
                  p.id === player.id ? updatedPlayer : p
                )
              }
            : team
        )
      );

      if (selectedTeam) {
        setSelectedTeam({
          ...selectedTeam,
          players: selectedTeam.players.map(p =>
            p.id === player.id ? updatedPlayer : p
          )
        });
      }

      toast.success(`${player.name} ${!player.is_starter ? 'definido como titular' : 'movido para reserva'}`);
    } catch (error) {
      console.error('Erro ao atualizar status do jogador:', error);
      toast.error('Erro ao atualizar status do jogador');
      // Revert changes if there's an error
      await fetchTeams();
    }
  };

  const handleToggleCaptain = async (player: P) => {
    try {
      const updatedPlayers = selectedTeam?.players.map(p => ({
        ...p,
        is_captain: p.id === player.id ? !p.is_captain : false
      })) || [];

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

      // Update local state immediately
      setTeams(prevTeams =>
        prevTeams.map(team =>
          team.id === selectedTeam?.id
            ? { ...team, players: updatedPlayers }
            : team
        )
      );

      if (selectedTeam) {
        setSelectedTeam({
          ...selectedTeam,
          players: updatedPlayers
        });
      }

      toast.success(`${player.name} ${!player.is_captain ? 'definido como capitão' : 'removido da capitania'}`);
    } catch (error) {
      console.error('Erro ao atualizar capitão:', error);
      toast.error('Erro ao atualizar capitão');
      // Revert changes if there's an error
      await fetchTeams();
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

      setTeams(teams.filter(team => team.id !== teamId));
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
          Times de {modality}
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
        />
        
        <TeamDetails
          selectedTeam={selectedTeam}
          onAddPlayer={handleAddPlayer}
          onEditPlayer={handleEditPlayer}
          onToggleStarter={handleToggleStarter}
          onToggleCaptain={handleToggleCaptain}
        />
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
        onChangeNewTeam={(field: string, value: any) => setNewTeam({ ...newTeam, [field]: value })}
        onChangeNewPlayer={(field: string, value: any) => setNewPlayer({ ...newPlayer, [field]: value })}
        onChangeEditingPlayer={(field: string, value: any) => editingPlayer && setEditingPlayer({ ...editingPlayer, [field]: value })}
        onChangeEditingTeam={(field: string, value: any) => editingTeam && setEditingTeam({ ...editingTeam, [field]: value })}
        positions={positions}
        formations={formations}
        onDeleteTeam={handleDeleteTeam}
      />
    </div>
  );
}
