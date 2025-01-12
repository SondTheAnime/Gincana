import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-toastify';
import { Modality, CreateModalityInput } from './types';

interface ModalityModalProps {
  isOpen: boolean;
  onClose: () => void;
  modality: Modality | null;
  onSuccess: () => void;
}

const ModalityModal = ({ isOpen, onClose, modality, onSuccess }: ModalityModalProps) => {
  const [formData, setFormData] = useState<CreateModalityInput>({
    name: '',
    description: '',
    is_active: true,
    is_team_sport: false,
    max_players: undefined,
    min_players: undefined,
  });

  useEffect(() => {
    if (modality) {
      setFormData({
        name: modality.name,
        description: modality.description,
        is_active: modality.is_active,
        is_team_sport: modality.is_team_sport,
        max_players: modality.max_players,
        min_players: modality.min_players,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        is_active: true,
        is_team_sport: false,
        max_players: undefined,
        min_players: undefined,
      });
    }
  }, [modality]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modality) {
        const { error } = await supabase
          .from('modalities')
          .update(formData)
          .eq('id', modality.id);

        if (error) throw error;
        toast.success('Modalidade atualizada com sucesso');
      } else {
        const { error } = await supabase
          .from('modalities')
          .insert([formData]);

        if (error) throw error;
        toast.success('Modalidade criada com sucesso');
      }

      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar modalidade:', error);
      toast.error('Erro ao salvar modalidade');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {modality ? 'Editar Modalidade' : 'Nova Modalidade'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              rows={3}
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_team_sport"
              checked={formData.is_team_sport}
              onChange={(e) => setFormData({ ...formData, is_team_sport: e.target.checked })}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="is_team_sport" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Esporte em Equipe
            </label>
          </div>

          {formData.is_team_sport && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mínimo de Jogadores
                </label>
                <input
                  type="number"
                  value={formData.min_players || ''}
                  onChange={(e) => setFormData({ ...formData, min_players: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Máximo de Jogadores
                </label>
                <input
                  type="number"
                  value={formData.max_players || ''}
                  onChange={(e) => setFormData({ ...formData, max_players: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  min="1"
                />
              </div>
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Ativo
            </label>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
            >
              {modality ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalityModal; 