import { X, Upload, Image } from 'lucide-react';
import { FutsalTeam, FutsalPlayer} from './types';
import { supabase } from '../../../../../lib/supabase';

interface FutsalTeamModalsProps {
  isAddingTeam: boolean;
  isAddingPlayer: boolean;
  isEditingPlayer: boolean;
  isEditingTeam: boolean;
  editingPlayer: FutsalPlayer | null;
  editingTeam: FutsalTeam | null;
  newTeam: {
    name: string;
    category: 'Masculino' | 'Feminino' | 'Misto';
    modality: string;
    coach: string;
    assistant_coach: string;
    home_court: string;
    formation: string;
  };
  newPlayer: {
    name: string;
    number: string;
    position: string;
    photo?: string;
    stats: {
      goals: number;
      assists: number;
      saves: number;
      clean_sheets: number;
      minutes_played: number;
      fouls_committed: number;
      fouls_suffered: number;
      yellow_cards: number;
      red_cards: number;
    };
  };
  positions: readonly string[];
  formations: readonly string[];
  onCloseAddTeam: () => void;
  onCloseAddPlayer: () => void;
  onCloseEditPlayer: () => void;
  onCloseEditTeam: () => void;
  onSubmitTeam: (e: React.FormEvent) => void;
  onSubmitPlayer: (e: React.FormEvent) => void;
  onChangeNewTeam: (field: string, value: string) => void;
  onChangeNewPlayer: (field: string, value: string | number) => void;
}

const CATEGORIES = ['Masculino', 'Feminino', 'Misto'] as const;

const FutsalTeamModals = ({
  isAddingTeam,
  isAddingPlayer,
  newTeam,
  newPlayer,
  positions,
  formations,
  onCloseAddTeam,
  onCloseAddPlayer,
  onSubmitTeam,
  onSubmitPlayer,
  onChangeNewTeam,
  onChangeNewPlayer
}: FutsalTeamModalsProps) => {
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      onChangeNewPlayer('photo', publicUrl);
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
    }
  };

  return (
    <>
      {/* Add Team Modal */}
      {isAddingTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-6 w-full max-w-md my-4">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Adicionar Novo Time de Futsal</h3>
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
                <label htmlFor="category" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoria
                </label>
                <select
                  id="category"
                  value={newTeam.category}
                  onChange={(e) => onChangeNewTeam('category', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="formation" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Formação
                </label>
                <select
                  id="formation"
                  value={newTeam.formation}
                  onChange={(e) => onChangeNewTeam('formation', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                >
                  {formations.map((formation) => (
                    <option key={formation} value={formation}>{formation}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="coach" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Técnico
                </label>
                <input
                  type="text"
                  id="coach"
                  value={newTeam.coach}
                  onChange={(e) => onChangeNewTeam('coach', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                />
              </div>

              <div>
                <label htmlFor="assistant_coach" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Técnico Auxiliar
                </label>
                <input
                  type="text"
                  id="assistant_coach"
                  value={newTeam.assistant_coach}
                  onChange={(e) => onChangeNewTeam('assistant_coach', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                />
              </div>

              <div>
                <label htmlFor="home_court" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quadra
                </label>
                <input
                  type="text"
                  id="home_court"
                  value={newTeam.home_court}
                  onChange={(e) => onChangeNewTeam('home_court', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                />
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
                    {newPlayer.photo ? (
                      <img 
                        src={newPlayer.photo} 
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
                      onChange={(e) => handlePhotoChange(e)}
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
                  type="number"
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
                  {positions.map((position) => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="goals" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gols
                  </label>
                  <input
                    type="number"
                    id="goals"
                    value={newPlayer.stats.goals}
                    onChange={(e) => onChangeNewPlayer('stats.goals', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                    min="0"
                  />
                </div>

                <div>
                  <label htmlFor="assists" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Assistências
                  </label>
                  <input
                    type="number"
                    id="assists"
                    value={newPlayer.stats.assists}
                    onChange={(e) => onChangeNewPlayer('stats.assists', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                    min="0"
                  />
                </div>

                {newPlayer.position === 'Goleiro' && (
                  <>
                    <div>
                      <label htmlFor="saves" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Defesas
                      </label>
                      <input
                        type="number"
                        id="saves"
                        value={newPlayer.stats.saves}
                        onChange={(e) => onChangeNewPlayer('stats.saves', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                        min="0"
                      />
                    </div>

                    <div>
                      <label htmlFor="clean_sheets" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Clean Sheets
                      </label>
                      <input
                        type="number"
                        id="clean_sheets"
                        value={newPlayer.stats.clean_sheets}
                        onChange={(e) => onChangeNewPlayer('stats.clean_sheets', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                        min="0"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="minutes_played" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Minutos Jogados
                  </label>
                  <input
                    type="number"
                    id="minutes_played"
                    value={newPlayer.stats.minutes_played}
                    onChange={(e) => onChangeNewPlayer('stats.minutes_played', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                    min="0"
                  />
                </div>

                <div>
                  <label htmlFor="fouls_committed" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Faltas Cometidas
                  </label>
                  <input
                    type="number"
                    id="fouls_committed"
                    value={newPlayer.stats.fouls_committed}
                    onChange={(e) => onChangeNewPlayer('stats.fouls_committed', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                    min="0"
                  />
                </div>

                <div>
                  <label htmlFor="fouls_suffered" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Faltas Sofridas
                  </label>
                  <input
                    type="number"
                    id="fouls_suffered"
                    value={newPlayer.stats.fouls_suffered}
                    onChange={(e) => onChangeNewPlayer('stats.fouls_suffered', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                    min="0"
                  />
                </div>

                <div>
                  <label htmlFor="yellow_cards" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cartões Amarelos
                  </label>
                  <input
                    type="number"
                    id="yellow_cards"
                    value={newPlayer.stats.yellow_cards}
                    onChange={(e) => onChangeNewPlayer('stats.yellow_cards', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                    min="0"
                  />
                </div>

                <div>
                  <label htmlFor="red_cards" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cartões Vermelhos
                  </label>
                  <input
                    type="number"
                    id="red_cards"
                    value={newPlayer.stats.red_cards}
                    onChange={(e) => onChangeNewPlayer('stats.red_cards', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm py-1.5 sm:py-2"
                    min="0"
                  />
                </div>
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
    </>
  );
};

export default FutsalTeamModals; 