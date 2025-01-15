import { X, Upload, Image } from 'lucide-react';
import { BaseTeam, BasePlayer, BaseTeamModalsProps } from './types';
import { supabase } from '../../../../../lib/supabase';

const CATEGORIES = ['Masculino', 'Feminino', 'Misto'] as const;

export function BaseTeamModals<T extends BaseTeam, P extends BasePlayer>({
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
  onDeleteTeam,
  renderPlayerStats // Nova prop para renderizar campos de estatísticas específicos
}: BaseTeamModalsProps<T, P> & {
  renderPlayerStats: (
    isEditing: boolean,
    player: Partial<P> | null,
    handleStatChange: (field: string, value: string, isEditing: boolean) => void
  ) => React.ReactNode;
}) {
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
            {/* Cabeçalho do Modal */}
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
              {/* ... campos de categoria, técnico, auxiliar, quadra e formação ... */}

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
            {/* ...cabeçalho do modal... */}

            <form onSubmit={isEditingPlayer ? onUpdatePlayer : onSubmitPlayer} className="space-y-4">
              {/* Upload de foto */}
              <div>
                {/* ...código do upload de foto... */}
              </div>

              {/* Campos básicos do jogador */}
              {/* ...campos comuns do jogador (nome, número, posição)... */}

              {/* Estatísticas específicas da modalidade */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Estatísticas</h4>
                <div className="grid grid-cols-2 gap-4">
                  {renderPlayerStats(
                    isEditingPlayer,
                    isEditingPlayer ? editingPlayer : newPlayer,
                    handleStatChange
                  )}
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
                ></button>
                  {isEditingPlayer ? 'Salvar Alterações' : 'Adicionar Jogador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
