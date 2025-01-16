import { X, Upload, Image } from 'lucide-react';
import { VoleiTeam, VoleiPlayer, VoleiStats } from './types';
import { supabase } from '../../../../../lib/supabase';

interface VoleiTeamModalsProps {
  isAddingTeam: boolean;
  isAddingPlayer: boolean;
  isEditingPlayer: boolean;
  isEditingTeam: boolean;
  editingPlayer: VoleiPlayer | null;
  editingTeam: VoleiTeam | null;
  newTeam: Partial<VoleiTeam>;
  newPlayer: Partial<VoleiPlayer>;
  onCloseAddTeam: () => void;
  onCloseAddPlayer: () => void;
  onCloseEditPlayer: () => void;
  onCloseEditTeam: () => void;
  onSubmitTeam: (e: React.FormEvent) => void;
  onSubmitPlayer: (e: React.FormEvent) => void;
  onUpdatePlayer: (e: React.FormEvent) => void;
  onUpdateTeam: (e: React.FormEvent) => void;
  onChangeNewTeam: (field: keyof VoleiTeam, value: VoleiTeam[keyof VoleiTeam]) => void;
  onChangeNewPlayer: (field: keyof VoleiPlayer, value: VoleiPlayer[keyof VoleiPlayer]) => void;
  onChangeEditingPlayer: (field: keyof VoleiPlayer, value: VoleiPlayer[keyof VoleiPlayer]) => void;
  onChangeEditingTeam: (field: keyof VoleiTeam, value: VoleiTeam[keyof VoleiTeam]) => void;
  positions: readonly string[];
  formations: readonly string[];
  onDeleteTeam: (teamId: number) => void;
}

const CATEGORIES = ['Masculino', 'Feminino', 'Misto'] as const;

const VoleiTeamModals = ({
  isAddingTeam,
  isAddingPlayer,
  isEditingPlayer,
  isEditingTeam,
  editingPlayer,
  editingTeam,
  newTeam,
  newPlayer,
  onCloseAddTeam,
  onCloseAddPlayer,
  onCloseEditPlayer,
  onCloseEditTeam,
  onSubmitTeam,
  onSubmitPlayer,
  onUpdatePlayer,
  onUpdateTeam,
  onChangeNewTeam,
  onChangeNewPlayer,
  onChangeEditingPlayer,
  onChangeEditingTeam,
  positions,
  formations,
  onDeleteTeam
}: VoleiTeamModalsProps) => {
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `player-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      if (isEditing) {
        onChangeEditingPlayer('photo', publicUrl);
      } else {
        onChangeNewPlayer('photo', publicUrl);
      }
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
    }
  };

  const handleStatChange = (field: string, value: string, isEditing: boolean) => {
    const numValue = parseInt(value) || 0;
    
    const baseStats: VoleiStats = isEditing
      ? {
          points: editingPlayer?.stats?.points ?? 0,
          aces: editingPlayer?.stats?.aces ?? 0,
          blocks: editingPlayer?.stats?.blocks ?? 0,
          kills: editingPlayer?.stats?.kills ?? 0,
          digs: editingPlayer?.stats?.digs ?? 0,
          assists: editingPlayer?.stats?.assists ?? 0,
          faults: editingPlayer?.stats?.faults ?? 0,
          reception_errors: editingPlayer?.stats?.reception_errors ?? 0,
          service_errors: editingPlayer?.stats?.service_errors ?? 0,
          attack_errors: editingPlayer?.stats?.attack_errors ?? 0,
          block_errors: editingPlayer?.stats?.block_errors ?? 0
        }
      : {
          points: newPlayer?.stats?.points ?? 0,
          aces: newPlayer?.stats?.aces ?? 0,
          blocks: newPlayer?.stats?.blocks ?? 0,
          kills: newPlayer?.stats?.kills ?? 0,
          digs: newPlayer?.stats?.digs ?? 0,
          assists: newPlayer?.stats?.assists ?? 0,
          faults: newPlayer?.stats?.faults ?? 0,
          reception_errors: newPlayer?.stats?.reception_errors ?? 0,
          service_errors: newPlayer?.stats?.service_errors ?? 0,
          attack_errors: newPlayer?.stats?.attack_errors ?? 0,
          block_errors: newPlayer?.stats?.block_errors ?? 0
        };

    const updatedStats: VoleiStats = {
      ...baseStats,
      [field]: numValue
    };

    if (isEditing) {
      onChangeEditingPlayer('stats', updatedStats);
    } else {
      onChangeNewPlayer('stats', updatedStats);
    }
  };

  return (
    <>
      {/* Modal de Time (Add/Edit) */}
      {(isAddingTeam || isEditingTeam) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {isEditingTeam ? 'Editar Time' : 'Adicionar Novo Time'}
              </h3>
              <button
                onClick={isEditingTeam ? onCloseEditTeam : onCloseAddTeam}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={isEditingTeam ? onUpdateTeam : onSubmitTeam} className="space-y-4">
              {/* Nome do Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome do Time
                </label>
                <input
                  type="text"
                  value={isEditingTeam && editingTeam ? editingTeam.name : newTeam.name}
                  onChange={(e) => isEditingTeam && editingTeam
                    ? onChangeEditingTeam('name', e.target.value)
                    : onChangeNewTeam('name', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoria
                </label>
                <select
                  value={isEditingTeam && editingTeam ? editingTeam.category : newTeam.category}
                  onChange={(e) => isEditingTeam && editingTeam
                    ? onChangeEditingTeam('category', e.target.value)
                    : onChangeNewTeam('category', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Técnico */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Técnico
                </label>
                <input
                  type="text"
                  value={isEditingTeam && editingTeam ? editingTeam.coach : newTeam.coach}
                  onChange={(e) => isEditingTeam && editingTeam
                    ? onChangeEditingTeam('coach', e.target.value)
                    : onChangeNewTeam('coach', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              {/* Auxiliar Técnico */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Auxiliar Técnico
                </label>
                <input
                  type="text"
                  value={isEditingTeam && editingTeam ? editingTeam.assistant_coach : newTeam.assistant_coach}
                  onChange={(e) => isEditingTeam && editingTeam
                    ? onChangeEditingTeam('assistant_coach', e.target.value)
                    : onChangeNewTeam('assistant_coach', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Quadra */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quadra
                </label>
                <input
                  type="text"
                  value={isEditingTeam && editingTeam ? editingTeam.home_court : newTeam.home_court}
                  onChange={(e) => isEditingTeam && editingTeam
                    ? onChangeEditingTeam('home_court', e.target.value)
                    : onChangeNewTeam('home_court', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              {/* Formação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Formação
                </label>
                <select
                  value={isEditingTeam && editingTeam ? editingTeam.formation : newTeam.formation}
                  onChange={(e) => isEditingTeam && editingTeam
                    ? onChangeEditingTeam('formation', e.target.value)
                    : onChangeNewTeam('formation', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {formations.map((formation) => (
                    <option key={formation} value={formation}>{formation}</option>
                  ))}
                </select>
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-between items-center mt-6">
                {isEditingTeam && editingTeam && (
                  <button
                    type="button"
                    onClick={() => onDeleteTeam(editingTeam.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-md"
                  >
                    Excluir Time
                  </button>
                )}
                <div className={`flex space-x-3 ${isEditingTeam ? 'ml-auto' : ''}`}>
                  <button
                    type="button"
                    onClick={isEditingTeam ? onCloseEditTeam : onCloseAddTeam}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 rounded-md"
                  >
                    {isEditingTeam ? 'Salvar Alterações' : 'Adicionar Time'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Jogador (Add/Edit) */}
      {(isAddingPlayer || isEditingPlayer) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {isEditingPlayer ? 'Editar Jogador' : 'Adicionar Novo Jogador'}
              </h3>
              <button
                onClick={isEditingPlayer ? onCloseEditPlayer : onCloseAddPlayer}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={isEditingPlayer ? onUpdatePlayer : onSubmitPlayer} className="space-y-4">
              {/* Foto do Jogador */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Foto do Jogador
                </label>
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {(isEditingPlayer && editingPlayer?.photo || newPlayer.photo) ? (
                      <img 
                        src={isEditingPlayer && editingPlayer ? editingPlayer.photo : newPlayer.photo} 
                        alt="Preview" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
                    <Upload className="h-4 w-4 mr-2" />
                    <span>Upload</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(e, isEditingPlayer)}
                    />
                  </label>
                </div>
              </div>

              {/* Nome do Jogador */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome do Jogador
                </label>
                <input
                  type="text"
                  value={isEditingPlayer && editingPlayer ? editingPlayer.name : newPlayer.name}
                  onChange={(e) => isEditingPlayer && editingPlayer
                    ? onChangeEditingPlayer('name', e.target.value)
                    : onChangeNewPlayer('name', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              {/* Número */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Número
                </label>
                <input
                  type="number"
                  value={isEditingPlayer && editingPlayer ? editingPlayer.number : newPlayer.number}
                  onChange={(e) => isEditingPlayer && editingPlayer
                    ? onChangeEditingPlayer('number', parseInt(e.target.value))
                    : onChangeNewPlayer('number', parseInt(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              {/* Posição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Posição
                </label>
                <select
                  value={isEditingPlayer && editingPlayer ? editingPlayer.position : newPlayer.position}
                  onChange={(e) => isEditingPlayer && editingPlayer
                    ? onChangeEditingPlayer('position', e.target.value)
                    : onChangeNewPlayer('position', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {positions.map((position) => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Estatísticas</h4>
                <div className="grid grid-cols-2 gap-4">
                  {/* Campos de estatísticas */}
                  {[
                    { key: 'points', label: 'Pontos' },
                    { key: 'aces', label: 'Aces' },
                    { key: 'blocks', label: 'Bloqueios' },
                    { key: 'kills', label: 'Ataques' },
                    { key: 'digs', label: 'Defesas' },
                    { key: 'assists', label: 'Levantamentos' },
                    { key: 'faults', label: 'Erros' },
                    { key: 'reception_errors', label: 'Erros de Recepção' },
                    { key: 'service_errors', label: 'Erros de Saque' },
                    { key: 'attack_errors', label: 'Erros de Ataque' },
                    { key: 'block_errors', label: 'Erros de Bloqueio' }
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {label}
                      </label>
                      <input
                        type="number"
                        value={isEditingPlayer && editingPlayer
                          ? editingPlayer.stats[key as keyof typeof editingPlayer.stats]
                          : newPlayer.stats?.[key as keyof typeof newPlayer.stats] || 0
                        }
                        onChange={(e) => handleStatChange(key, e.target.value, isEditingPlayer)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        min="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkboxes de titular e capitão */}
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isEditingPlayer && editingPlayer ? editingPlayer.is_starter : false}
                    onChange={(e) => isEditingPlayer && editingPlayer && onChangeEditingPlayer('is_starter', e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Titular
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isEditingPlayer && editingPlayer ? editingPlayer.is_captain : false}
                    onChange={(e) => isEditingPlayer && editingPlayer && onChangeEditingPlayer('is_captain', e.target.checked)}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Capitão
                  </label>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={isEditingPlayer ? onCloseEditPlayer : onCloseAddPlayer}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 rounded-md"
                >
                  {isEditingPlayer ? 'Salvar Alterações' : 'Adicionar Jogador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default VoleiTeamModals;
