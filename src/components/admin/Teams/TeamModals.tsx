import { X, Trophy, Upload, Image } from 'lucide-react';
import { Team, Player } from './types';
import { useState } from 'react';

interface TeamModalsProps {
  isAddingTeam: boolean;
  isAddingPlayer: boolean;
  isEditingPlayer: boolean;
  isEditingTeam: boolean;
  editingPlayer: Player | null;
  editingTeam: Team | null;
  newTeam: { name: string; category: string; modality: string };
  newPlayer: { name: string; number: string; position: string };
  positions: string[];
  modalities: string[];
  newAward: string;
  onCloseAddTeam: () => void;
  onCloseAddPlayer: () => void;
  onCloseEditPlayer: () => void;
  onCloseEditTeam: () => void;
  onSubmitTeam: (e: React.FormEvent) => void;
  onSubmitPlayer: (e: React.FormEvent) => void;
  onUpdatePlayer: (e: React.FormEvent) => void;
  onUpdateTeam: (e: React.FormEvent) => void;
  onChangeNewTeam: (field: string, value: string) => void;
  onChangeNewPlayer: (field: string, value: string) => void;
  onChangeEditingPlayer: (field: string, value: string | number | boolean) => void;
  onChangeEditingTeam: (field: string, value: string) => void;
  onAddAward: (e: React.FormEvent) => void;
  onRemoveAward: (award: string) => void;
  onChangeNewAward: (value: string) => void;
}

const TeamModals = ({
  isAddingTeam,
  isAddingPlayer,
  isEditingPlayer,
  isEditingTeam,
  editingPlayer,
  editingTeam,
  newTeam,
  newPlayer,
  positions,
  modalities,
  newAward,
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
  onAddAward,
  onRemoveAward,
  onChangeNewAward
}: TeamModalsProps) => {
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEditing) {
          onChangeEditingPlayer('photo', base64String);
        } else {
          onChangeNewPlayer('photo', base64String);
        }
        setTempPhoto(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Add Team Modal */}
      {isAddingTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-6 w-full max-w-md my-4">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Adicionar Novo Time</h3>
              <button
                onClick={onCloseAddTeam}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Fechar"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
            <form onSubmit={onSubmitTeam} className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="teamName" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome do Time
                </label>
                <input
                  type="text"
                  id="teamName"
                  value={newTeam.name}
                  onChange={(e) => onChangeNewTeam('name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="modality" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Modalidade
                </label>
                <select
                  id="modality"
                  value={newTeam.modality}
                  onChange={(e) => onChangeNewTeam('modality', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                >
                  {modalities.map((modality) => (
                    <option key={modality} value={modality}>{modality}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="category" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoria
                </label>
                <select
                  id="category"
                  value={newTeam.category}
                  onChange={(e) => onChangeNewTeam('category', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Misto">Misto</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 sm:space-x-3 mt-4 sm:mt-6">
                <button
                  type="button"
                  onClick={onCloseAddTeam}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 rounded-md"
                >
                  Adicionar Time
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Player Modal */}
      {isAddingPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-6 w-full max-w-md my-4">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Adicionar Novo Jogador</h3>
              <button
                onClick={onCloseAddPlayer}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Fechar"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
            <form onSubmit={onSubmitPlayer} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                  Foto do Jogador
                </label>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {tempPhoto ? (
                      <img 
                        src={tempPhoto} 
                        alt="Preview" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                    )}
                  </div>
                  <label className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
                    <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    <span>Upload</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(e, false)}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="playerName" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome do Jogador
                </label>
                <input
                  type="text"
                  id="playerName"
                  value={newPlayer.name}
                  onChange={(e) => onChangeNewPlayer('name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="playerNumber" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Número
                </label>
                <input
                  type="text"
                  id="playerNumber"
                  value={newPlayer.number}
                  onChange={(e) => onChangeNewPlayer('number', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="position" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Posição
                </label>
                <select
                  id="position"
                  value={newPlayer.position}
                  onChange={(e) => onChangeNewPlayer('position', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                >
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2 sm:space-x-3 mt-4 sm:mt-6">
                <button
                  type="button"
                  onClick={onCloseAddPlayer}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 rounded-md"
                >
                  Adicionar Jogador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Player Modal */}
      {isEditingPlayer && editingPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-6 w-full max-w-md my-4">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Editar Jogador</h3>
              <button
                onClick={onCloseEditPlayer}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Fechar"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
            <form onSubmit={onUpdatePlayer} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                  Foto do Jogador
                </label>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {editingPlayer.photo ? (
                      <img 
                        src={editingPlayer.photo} 
                        alt={editingPlayer.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                    )}
                  </div>
                  <label className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
                    <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    <span>Upload</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(e, true)}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="editPlayerName" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome do Jogador
                </label>
                <input
                  type="text"
                  id="editPlayerName"
                  value={editingPlayer.name}
                  onChange={(e) => onChangeEditingPlayer('name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                  required
                />
              </div>

              <div>
                <label htmlFor="editPlayerNumber" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Número
                </label>
                <input
                  type="text"
                  id="editPlayerNumber"
                  value={editingPlayer.number}
                  onChange={(e) => onChangeEditingPlayer('number', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                  required
                />
              </div>

              <div>
                <label htmlFor="editPosition" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Posição
                </label>
                <select
                  id="editPosition"
                  value={editingPlayer.position}
                  onChange={(e) => onChangeEditingPlayer('position', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                >
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="yellowCards" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cartões Amarelos
                  </label>
                  <input
                    type="number"
                    id="yellowCards"
                    min="0"
                    value={editingPlayer.yellowCards}
                    onChange={(e) => onChangeEditingPlayer('yellowCards', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                  />
                </div>

                <div>
                  <label htmlFor="redCards" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cartões Vermelhos
                  </label>
                  <input
                    type="number"
                    id="redCards"
                    min="0"
                    value={editingPlayer.redCards}
                    onChange={(e) => onChangeEditingPlayer('redCards', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="suspended"
                  checked={editingPlayer.suspended}
                  onChange={(e) => onChangeEditingPlayer('suspended', e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="suspended" className="ml-2 block text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Jogador Suspenso
                </label>
              </div>

              <div className="flex justify-end space-x-2 sm:space-x-3 mt-4 sm:mt-6">
                <button
                  type="button"
                  onClick={onCloseEditPlayer}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 rounded-md"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {isEditingTeam && editingTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-6 w-full max-w-md my-4">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Editar Time</h3>
              <button
                onClick={onCloseEditTeam}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Fechar"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
            <form onSubmit={onUpdateTeam} className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="editTeamName" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome do Time
                </label>
                <input
                  type="text"
                  id="editTeamName"
                  value={editingTeam.name}
                  onChange={(e) => onChangeEditingTeam('name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                  required
                />
              </div>

              <div>
                <label htmlFor="editModality" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Modalidade
                </label>
                <select
                  id="editModality"
                  value={editingTeam.modality}
                  onChange={(e) => onChangeEditingTeam('modality', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                >
                  {modalities.map((modality) => (
                    <option key={modality} value={modality}>{modality}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="editCategory" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoria
                </label>
                <select
                  id="editCategory"
                  value={editingTeam.category}
                  onChange={(e) => onChangeEditingTeam('category', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Misto">Misto</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Conquistas
                </label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newAward}
                      onChange={(e) => onChangeNewAward(e.target.value)}
                      placeholder="Adicionar conquista..."
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                    />
                    <button
                      type="button"
                      onClick={onAddAward}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 rounded-md"
                    >
                      Adicionar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editingTeam.awards.map((award, index) => (
                      <div
                        key={index}
                        className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded-md flex items-center space-x-1"
                      >
                        <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-yellow-700 dark:text-yellow-300 text-xs sm:text-sm">
                          {award}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveAward(award)}
                          className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
                          aria-label="Remover conquista"
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 sm:space-x-3 mt-4 sm:mt-6">
                <button
                  type="button"
                  onClick={onCloseEditTeam}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 rounded-md"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TeamModals; 