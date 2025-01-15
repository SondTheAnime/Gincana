import { X } from 'lucide-react';
import { TableTennisTeam, TableTennisPlayer } from './types';

interface TableTennisTeamModalsProps {
  isAddingTeam: boolean;
  isAddingPlayer: boolean;
  isEditingPlayer: boolean;
  isEditingTeam: boolean;
  editingPlayer: TableTennisPlayer | null;
  editingTeam: TableTennisTeam | null;
  newTeam: Partial<TableTennisTeam>;
  newPlayer: Partial<TableTennisPlayer>;
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
  onDeleteTeam: (teamId: number) => void;
}

const TableTennisTeamModals = ({
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
  onDeleteTeam,
}: TableTennisTeamModalsProps) => {
  const renderTeamForm = (
    isEditing: boolean,
    team: Partial<TableTennisTeam>,
    onSubmit: (e: React.FormEvent) => void,
    onChange: (field: string, value: any) => void
  ) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor={`${isEditing ? 'edit' : 'new'}-team-name`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Nome do Time
        </label>
        <input
          type="text"
          id={`${isEditing ? 'edit' : 'new'}-team-name`}
          value={team.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor={`${isEditing ? 'edit' : 'new'}-team-category`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Categoria
        </label>
        <select
          id={`${isEditing ? 'edit' : 'new'}-team-category`}
          value={team.category || 'Masculino'}
          onChange={(e) => onChange('category', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
        >
          <option value="Masculino">Masculino</option>
          <option value="Feminino">Feminino</option>
          <option value="Misto">Misto</option>
        </select>
      </div>

      <div>
        <label
          htmlFor={`${isEditing ? 'edit' : 'new'}-team-coach`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Técnico
        </label>
        <input
          type="text"
          id={`${isEditing ? 'edit' : 'new'}-team-coach`}
          value={team.coach || ''}
          onChange={(e) => onChange('coach', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor={`${isEditing ? 'edit' : 'new'}-team-assistant`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Técnico Assistente
        </label>
        <input
          type="text"
          id={`${isEditing ? 'edit' : 'new'}-team-assistant`}
          value={team.assistant_coach || ''}
          onChange={(e) => onChange('assistant_coach', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor={`${isEditing ? 'edit' : 'new'}-team-court`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Local de Treino
        </label>
        <input
          type="text"
          id={`${isEditing ? 'edit' : 'new'}-team-court`}
          value={team.home_court || ''}
          onChange={(e) => onChange('home_court', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-3">
        {isEditing && (
          <button
            type="button"
            onClick={() => onDeleteTeam(team.id!)}
            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Excluir Time
          </button>
        )}
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isEditing ? 'Atualizar' : 'Criar'} Time
        </button>
      </div>
    </form>
  );

  const renderPlayerForm = (
    isEditing: boolean,
    player: Partial<TableTennisPlayer>,
    onSubmit: (e: React.FormEvent) => void,
    onChange: (field: string, value: any) => void
  ) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor={`${isEditing ? 'edit' : 'new'}-player-name`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Nome do Jogador
        </label>
        <input
          type="text"
          id={`${isEditing ? 'edit' : 'new'}-player-name`}
          value={player.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor={`${isEditing ? 'edit' : 'new'}-player-number`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Número
        </label>
        <input
          type="number"
          id={`${isEditing ? 'edit' : 'new'}-player-number`}
          value={player.number || ''}
          onChange={(e) => onChange('number', parseInt(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor={`${isEditing ? 'edit' : 'new'}-player-position`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Posição
        </label>
        <select
          id={`${isEditing ? 'edit' : 'new'}-player-position`}
          value={player.position || positions[0]}
          onChange={(e) => onChange('position', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
        >
          {positions.map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor={`${isEditing ? 'edit' : 'new'}-player-grip`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Estilo de Empunhadura
        </label>
        <select
          id={`${isEditing ? 'edit' : 'new'}-player-grip`}
          value={player.grip_style || 'Clássica'}
          onChange={(e) => onChange('grip_style', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
        >
          <option value="Clássica">Clássica</option>
          <option value="Caneta">Caneta</option>
          <option value="Híbrida">Híbrida</option>
        </select>
      </div>

      <div>
        <label
          htmlFor={`${isEditing ? 'edit' : 'new'}-player-style`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Estilo de Jogo
        </label>
        <select
          id={`${isEditing ? 'edit' : 'new'}-player-style`}
          value={player.play_style || 'All-around'}
          onChange={(e) => onChange('play_style', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
        >
          <option value="Ofensivo">Ofensivo</option>
          <option value="Defensivo">Defensivo</option>
          <option value="All-around">All-around</option>
        </select>
      </div>

      <div>
        <label
          htmlFor={`${isEditing ? 'edit' : 'new'}-player-photo`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Foto (URL)
        </label>
        <input
          type="url"
          id={`${isEditing ? 'edit' : 'new'}-player-photo`}
          value={player.photo || ''}
          onChange={(e) => onChange('photo', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isEditing ? 'Atualizar' : 'Adicionar'} Jogador
        </button>
      </div>
    </form>
  );

  const renderModal = (
    isOpen: boolean,
    title: string,
    onClose: () => void,
    content: React.ReactNode
  ) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={onClose}
          />

          <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none dark:hover:text-gray-300"
                onClick={onClose}
              >
                <span className="sr-only">Fechar</span>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="sm:flex sm:items-start">
              <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  {title}
                </h3>
                <div className="mt-4">{content}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderModal(
        isAddingTeam,
        'Adicionar Time',
        onCloseAddTeam,
        renderTeamForm(false, newTeam, onSubmitTeam, onChangeNewTeam)
      )}
      {renderModal(
        isEditingTeam,
        'Editar Time',
        onCloseEditTeam,
        renderTeamForm(
          true,
          editingTeam || {},
          onUpdateTeam,
          onChangeEditingTeam
        )
      )}
      {renderModal(
        isAddingPlayer,
        'Adicionar Jogador',
        onCloseAddPlayer,
        renderPlayerForm(false, newPlayer, onSubmitPlayer, onChangeNewPlayer)
      )}
      {renderModal(
        isEditingPlayer,
        'Editar Jogador',
        onCloseEditPlayer,
        renderPlayerForm(
          true,
          editingPlayer || {},
          onUpdatePlayer,
          onChangeEditingPlayer
        )
      )}
    </>
  );
};

export default TableTennisTeamModals;
