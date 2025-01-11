import { useState } from 'react';
import { Users } from 'lucide-react';
import { Team, Player } from './types';
import TeamsList from './TeamsList';
import TeamDetails from './TeamDetails';
import TeamModals from './TeamModals';

const ManageTeams = () => {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 1,
      name: 'Informática',
      category: 'Masculino',
      modality: 'Futsal',
      players: [
        {
          id: 1,
          name: 'João Silva',
          number: '10',
          position: 'Atacante',
          yellowCards: 1,
          redCards: 0,
          suspended: false,
          photo: undefined
        }
      ],
      awards: []
    }
  ]);

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [isEditingPlayer, setIsEditingPlayer] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [newAward, setNewAward] = useState('');

  const positions = ['Goleiro', 'Defensor', 'Meio-Campo', 'Atacante'];
  const modalities = ['Futsal', 'Vôlei', 'Basquete', 'Handebol'];

  const [newTeam, setNewTeam] = useState({
    name: '',
    category: 'Masculino',
    modality: 'Futsal'
  });

  const [newPlayer, setNewPlayer] = useState({
    name: '',
    number: '',
    position: 'Goleiro',
    photo: undefined as string | undefined
  });

  const handleAddTeam = () => {
    setIsAddingTeam(true);
  };

  const handleAddPlayer = () => {
    setIsAddingPlayer(true);
  };

  const handleSubmitTeam = (e: React.FormEvent) => {
    e.preventDefault();
    const newTeamData: Team = {
      id: teams.length + 1,
      name: newTeam.name,
      category: newTeam.category,
      modality: newTeam.modality,
      players: [],
      awards: []
    };
    setTeams([...teams, newTeamData]);
    setNewTeam({ name: '', category: 'Masculino', modality: 'Futsal' });
    setIsAddingTeam(false);
  };

  const handleSubmitPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;

    const newPlayerData: Player = {
      id: selectedTeam.players.length + 1,
      name: newPlayer.name,
      number: newPlayer.number,
      position: newPlayer.position,
      yellowCards: 0,
      redCards: 0,
      suspended: false,
      photo: newPlayer.photo
    };

    const updatedTeams = teams.map(team => {
      if (team.id === selectedTeam.id) {
        return {
          ...team,
          players: [...team.players, newPlayerData]
        };
      }
      return team;
    });

    setTeams(updatedTeams);
    setSelectedTeam({
      ...selectedTeam,
      players: [...selectedTeam.players, newPlayerData]
    });
    setNewPlayer({ name: '', number: '', position: 'Goleiro', photo: undefined });
    setIsAddingPlayer(false);
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setIsEditingPlayer(true);
  };

  const handleUpdatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer || !selectedTeam) return;

    const updatedTeams = teams.map(team => {
      if (team.id === selectedTeam.id) {
        return {
          ...team,
          players: team.players.map(player => 
            player.id === editingPlayer.id ? editingPlayer : player
          )
        };
      }
      return team;
    });

    setTeams(updatedTeams);
    setSelectedTeam({
      ...selectedTeam,
      players: selectedTeam.players.map(player =>
        player.id === editingPlayer.id ? editingPlayer : player
      )
    });
    setIsEditingPlayer(false);
    setEditingPlayer(null);
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setIsEditingTeam(true);
  };

  const handleUpdateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;

    const updatedTeams = teams.map(team => 
      team.id === editingTeam.id ? editingTeam : team
    );

    setTeams(updatedTeams);
    setSelectedTeam(editingTeam);
    setIsEditingTeam(false);
    setEditingTeam(null);
  };

  const handleAddAward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam || !newAward.trim()) return;

    const updatedTeam = {
      ...editingTeam,
      awards: [...editingTeam.awards, newAward.trim()]
    };
    setEditingTeam(updatedTeam);
    setNewAward('');
  };

  const handleRemoveAward = (awardToRemove: string) => {
    if (!editingTeam) return;

    const updatedTeam = {
      ...editingTeam,
      awards: editingTeam.awards.filter(award => award !== awardToRemove)
    };
    setEditingTeam(updatedTeam);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Times</h2>
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
        positions={positions}
        modalities={modalities}
        newAward={newAward}
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
        onChangeNewAward={setNewAward}
      />
    </div>
  );
};

export default ManageTeams; 