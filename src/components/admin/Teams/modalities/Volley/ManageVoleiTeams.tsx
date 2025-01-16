import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { VoleiTeam, VoleiPlayer } from './types';
import VoleiTeamsList from './VoleiTeamsList';
import VoleiTeamDetails from './VoleiTeamDetails';
import VoleiTeamModals from './VoleiTeamModals';
import { supabase } from '../../../../../lib/supabase';
import { toast } from 'react-toastify';

const POSITIONS = ['Levantador', 'Oposto', 'Ponteiro', 'Central', 'Líbero'] as const;
const FORMATIONS = ['5-1', '4-2', '6-0'] as const;

type PlayerStats = {
  points: number
  aces: number
  blocks: number
  kills: number
  digs: number
  assists: number
  faults: number
  reception_errors: number
  service_errors: number
  attack_errors: number
  block_errors: number
}

type DbPlayer = {
  id: number
  name: string
  number: string
  position: string
  team_id: number
  stats: PlayerStats | null
}

type DbTeam = {
  id: number
  name: string
  modality: string
  category: string
  turma: string
  coach: string
  assistant_coach: string | null
  players: DbPlayer[]
}

const ManageVoleiTeams = () => {
  // Estados similares ao ManageFutsalTeams
  const [teams, setTeams] = useState<VoleiTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<VoleiTeam | null>(null);
  const [players, setPlayers] = useState<VoleiPlayer[]>([]);
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [isEditingPlayer, setIsEditingPlayer] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<VoleiPlayer | null>(null);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editingTeam, setEditingTeam] = useState<VoleiTeam | null>(null);
  const [loading, setLoading] = useState(true);

  const [newTeam, setNewTeam] = useState<Partial<VoleiTeam>>({
    name: '',
    category: 'Masculino',
    modality: 'Vôlei',
    coach: '',
    assistant_coach: '',
    home_court: '',
    formation: '5-1'
  });

  const [newPlayer, setNewPlayer] = useState<Partial<VoleiPlayer>>({
    name: '',
    number: 0,
    position: 'Ponteiro',
    photo: undefined,
    stats: {
      points: 0,
      aces: 0,
      blocks: 0,
      kills: 0,
      digs: 0,
      assists: 0,
      faults: 0,
      reception_errors: 0,
      service_errors: 0,
      attack_errors: 0,
      block_errors: 0
    }
  });

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

  useEffect(() => {
    if (selectedTeam) {
      setPlayers(selectedTeam.players);
    }
  }, [selectedTeam]);

  const fetchTeams = async () => {
    try {
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*, players(*)')
        .eq('modality', 'Vôlei')
        .order('name');

      if (teamsError) throw teamsError;

      const voleiTeams: VoleiTeam[] = (teamsData as DbTeam[]).map((team) => ({
        ...team,
        coach: team.coach || undefined,
        assistant_coach: team.assistant_coach || undefined,
        players: (team.players || []).map((player) => ({
          ...player,
          stats: {
            points: player.stats?.points || 0,
            aces: player.stats?.aces || 0,
            blocks: player.stats?.blocks || 0,
            kills: player.stats?.kills || 0,
            digs: player.stats?.digs || 0,
            assists: player.stats?.assists || 0,
            faults: player.stats?.faults || 0,
            reception_errors: player.stats?.reception_errors || 0,
            service_errors: player.stats?.service_errors || 0,
            attack_errors: player.stats?.attack_errors || 0,
            block_errors: player.stats?.block_errors || 0
          }
        }))
      }));

      setTeams(voleiTeams);
    } catch (error) {
      console.error('Erro ao buscar times:', error);
      toast.error('Erro ao carregar times. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeam = () => setIsAddingTeam(true);
  const handleAddPlayer = () => setIsAddingPlayer(true);
  const handleEditTeam = (team: VoleiTeam) => {
    setEditingTeam(team);
    setIsEditingTeam(true);
  };
  const handleEditPlayer = (player: VoleiPlayer) => {
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
          modality: 'Vôlei',
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
        modality: 'Vôlei',
        coach: '',
        assistant_coach: '',
        home_court: '',
        formation: '5-1'
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

      const newPlayerData = data as VoleiPlayer;

      // Atualizar o estado teams
      setTeams(prevTeams => 
        prevTeams.map(team => 
          team.id === selectedTeam.id 
            ? { ...team, players: [...team.players, newPlayerData] }
            : team
        )
      );

      // Atualizar o estado players
      setPlayers(prevPlayers => [...prevPlayers, newPlayerData]);

      setNewPlayer({
        name: '',
        number: 0,
        position: 'Ponteiro',
        photo: undefined,
        stats: {
          points: 0,
          aces: 0,
          blocks: 0,
          kills: 0,
          digs: 0,
          assists: 0,
          faults: 0,
          reception_errors: 0,
          service_errors: 0,
          attack_errors: 0,
          block_errors: 0
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
      const stats = {
        points: editingPlayer.stats.points || 0,
        aces: editingPlayer.stats.aces || 0,
        blocks: editingPlayer.stats.blocks || 0,
        kills: editingPlayer.stats.kills || 0,
        digs: editingPlayer.stats.digs || 0,
        assists: editingPlayer.stats.assists || 0,
        faults: editingPlayer.stats.faults || 0,
        reception_errors: editingPlayer.stats.reception_errors || 0,
        service_errors: editingPlayer.stats.service_errors || 0,
        attack_errors: editingPlayer.stats.attack_errors || 0,
        block_errors: editingPlayer.stats.block_errors || 0
      };

      const { error } = await supabase
        .from('players')
        .update({
          name: editingPlayer.name,
          number: editingPlayer.number,
          photo: editingPlayer.photo,
          position: editingPlayer.position,
          stats: stats
        })
        .eq('id', editingPlayer.id);

      if (error) throw error;

      const updatedTeams = teams.map(team => ({
        ...team,
        players: team.players.map(p => 
          p.id === editingPlayer.id ? { ...editingPlayer, stats } : p
        )
      }));
      
      setTeams(updatedTeams);
      
      // Atualizar o estado players
      setPlayers(prevPlayers => 
        prevPlayers.map(p => 
          p.id === editingPlayer.id ? { ...editingPlayer, stats } : p
        )
      );
      
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

  const handleToggleStarter = async (player: VoleiPlayer) => {
    try {
      const { error } = await supabase
        .from('players')
        .update({ is_starter: !player.is_starter })
        .eq('id', player.id);

      if (error) throw error;

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
      
      // Atualizar o estado players
      setPlayers(prevPlayers =>
        prevPlayers.map(p =>
          p.id === player.id
            ? { ...p, is_starter: !p.is_starter }
            : p
        )
      );
      
      if (selectedTeam && selectedTeam.id === player.team_id) {
        setSelectedTeam(updatedTeams.find(team => team.id === player.team_id) || null);
      }

      toast.success(`${player.name} ${!player.is_starter ? 'definido como titular' : 'movido para reserva'}`);
    } catch (error) {
      console.error('Erro ao atualizar status do jogador:', error);
      toast.error('Erro ao atualizar status do jogador');
    }
  };

  const handleToggleCaptain = async (player: VoleiPlayer) => {
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
      
      // Atualizar o estado players
      setPlayers(prevPlayers =>
        prevPlayers.map(p =>
          p.id === player.id
            ? { ...p, is_captain: !p.is_captain }
            : { ...p, is_captain: false }
        )
      );
      
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
    if (!window.confirm(
      'ATENÇÃO: Esta ação irá:\n\n' +
      '- Excluir o time\n' +
      '- Excluir todos os jogadores do time\n' +
      '- Excluir todas as solicitações de jogadores pendentes\n\n' +
      'Esta ação não pode ser desfeita. Deseja continuar?'
    )) {
      return;
    }

    try {
      // Deletar solicitações de jogadores
      const { error: playerRequestsError } = await supabase
        .from('player_requests')
        .delete()
        .eq('team_id', teamId);

      if (playerRequestsError) {
        console.error('Erro ao excluir solicitações de jogadores:', playerRequestsError);
        throw playerRequestsError;
      }

      // Deletar jogadores
      const { error: playersError } = await supabase
        .from('players')
        .delete()
        .eq('team_id', teamId);

      if (playersError) {
        console.error('Erro ao excluir jogadores:', playersError);
        throw playersError;
      }

      // Finalmente, deletar o time
      const { error: teamError } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (teamError) {
        console.error('Erro ao excluir time:', teamError);
        throw teamError;
      }

      const updatedTeams = teams.filter(team => team.id !== teamId);
      setTeams(updatedTeams);
      
      if (selectedTeam?.id === teamId) {
        setSelectedTeam(null);
      }

      setIsEditingTeam(false);
      setEditingTeam(null);
      toast.success('Time e todos os registros relacionados foram excluídos com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir time e registros relacionados:', error);
      toast.error('Erro ao excluir time e registros relacionados. Tente novamente.');
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
          Times de Vôlei
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
        <VoleiTeamsList
          teams={teams}
          selectedTeam={selectedTeam}
          onSelectTeam={setSelectedTeam}
          onEditTeam={handleEditTeam}
        />
        
        <VoleiTeamDetails
          selectedTeam={selectedTeam}
          onAddPlayer={handleAddPlayer}
          onEditPlayer={handleEditPlayer}
          onToggleStarter={handleToggleStarter}
          onToggleCaptain={handleToggleCaptain}
          players={players}
          setPlayers={setPlayers}
        />
      </div>

      <VoleiTeamModals
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

export default ManageVoleiTeams;
