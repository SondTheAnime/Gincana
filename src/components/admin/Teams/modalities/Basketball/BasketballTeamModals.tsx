import { X, Upload, Image } from 'lucide-react';
import { BasketballTeam, BasketballPlayer } from './types';
import { supabase } from '../../../../../lib/supabase';

interface BasketballTeamModalsProps {
  isAddingTeam: boolean;
  isAddingPlayer: boolean;
  isEditingPlayer: boolean;
  isEditingTeam: boolean;
  editingPlayer: BasketballPlayer | null;
  editingTeam: BasketballTeam | null;
  newTeam: Partial<BasketballTeam>;
  newPlayer: Partial<BasketballPlayer>;
  onCloseAddTeam: () => void;
  onCloseAddPlayer: () => void;
  onCloseEditPlayer: () => void;
  onCloseEditTeam: () => void;
  onSubmitTeam: (e: React.FormEvent) => void;
  onSubmitPlayer: (e: React.FormEvent) => void;
  onUpdatePlayer: (e: React.FormEvent) => void;
  onUpdateTeam: (e: React.FormEvent) => void;
  onChangeNewTeam: (field: string, value: any) => void;
  onChangeNewPlayer: (field: string, value: any) => void;
  onChangeEditingPlayer: (field: string, value: any) => void;
  onChangeEditingTeam: (field: string, value: any) => void;
  positions: readonly string[];
  formations: readonly string[];
  onDeleteTeam: (teamId: number) => void;
}

const CATEGORIES = ['Masculino', 'Feminino', 'Misto'] as const;

const BasketballTeamModals = ({
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
}: BasketballTeamModalsProps) => {
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
    const stats = isEditing
      ? { ...(editingPlayer?.stats || {}), [field]: numValue }
      : { ...(newPlayer.stats || {}), [field]: numValue };

    if (isEditing) {
      onChangeEditingPlayer('stats', stats);
    } else {
      onChangeNewPlayer('stats', stats);
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

              {/* Ginásio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ginásio
                </label>
                <input
                  type="text"
                  value={isEditingTeam && editingTeam ? editingTeam.home_court : newTeam.home_court}
                  onChange={(e) => isEditingTeam && editingTeam
                    ? onChangeEditingTeam('home_court', e.target.value)
                    : onChangeNewTeam('home_court', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={isEditingTeam ? onCloseEditTeam : onCloseAddTeam}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancelar
                </button>
                {isEditingTeam && (
                  <button
                    type="button"
                    onClick={() => editingTeam && onDeleteTeam(editingTeam.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Excluir Time
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  {isEditingTeam ? 'Salvar Alterações' : 'Adicionar Time'}
                </button>
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

              {/* Foto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Foto
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    {(isEditingPlayer && editingPlayer?.photo) || (!isEditingPlayer && newPlayer.photo) ? (
                      <img
                        src={isEditingPlayer ? editingPlayer?.photo : newPlayer.photo}
                        alt="Foto do jogador"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(e, isEditingPlayer)}
                    />
                  </label>
                </div>
              </div>

              {/* Estatísticas */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estatísticas
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Pontos
                    </label>
                    <input
                      type="number"
                      value={isEditingPlayer && editingPlayer ? editingPlayer.stats.points : newPlayer.stats?.points || 0}
                      onChange={(e) => handleStatChange('points', e.target.value, isEditingPlayer)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Assistências
                    </label>
                    <input
                      type="number"
                      value={isEditingPlayer && editingPlayer ? editingPlayer.stats.assists : newPlayer.stats?.assists || 0}
                      onChange={(e) => handleStatChange('assists', e.target.value, isEditingPlayer)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Rebotes
                    </label>
                    <input
                      type="number"
                      value={isEditingPlayer && editingPlayer ? editingPlayer.stats.rebounds : newPlayer.stats?.rebounds || 0}
                      onChange={(e) => handleStatChange('rebounds', e.target.value, isEditingPlayer)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Roubos de Bola
                    </label>
                    <input
                      type="number"
                      value={isEditingPlayer && editingPlayer ? editingPlayer.stats.steals : newPlayer.stats?.steals || 0}
                      onChange={(e) => handleStatChange('steals', e.target.value, isEditingPlayer)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Bloqueios
                    </label>
                    <input
                      type="number"
                      value={isEditingPlayer && editingPlayer ? editingPlayer.stats.blocks : newPlayer.stats?.blocks || 0}
                      onChange={(e) => handleStatChange('blocks', e.target.value, isEditingPlayer)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Faltas
                    </label>
                    <input
                      type="number"
                      value={isEditingPlayer && editingPlayer ? editingPlayer.stats.fouls : newPlayer.stats?.fouls || 0}
                      onChange={(e) => handleStatChange('fouls', e.target.value, isEditingPlayer)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={isEditingPlayer ? onCloseEditPlayer : onCloseAddPlayer}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
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

export default BasketballTeamModals;
