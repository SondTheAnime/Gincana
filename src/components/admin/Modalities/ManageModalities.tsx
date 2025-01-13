import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-toastify';
import { Modality } from './types';
import ModalityModal from './ModalityModal';

const ManageModalities = () => {
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModality, setSelectedModality] = useState<Modality | null>(null);

  useEffect(() => {
    fetchModalities();
  }, []);

  const fetchModalities = async () => {
    try {
      const { data, error } = await supabase
        .from('modalities')
        .select('*')
        .order('name');

      if (error) throw error;

      setModalities(data || []);
    } catch (error) {
      console.error('Erro ao buscar modalidades:', error);
      toast.error('Erro ao carregar modalidades');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddModality = () => {
    setSelectedModality(null);
    setIsModalOpen(true);
  };

  const handleEditModality = (modality: Modality) => {
    setSelectedModality(modality);
    setIsModalOpen(true);
  };

  const handleDeleteModality = async (id: string) => {
    try {
      // Primeiro, verificar se existem times usando esta modalidade
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('id, name')
        .eq('modality', id);

      if (teamsError) throw teamsError;

      // Se existirem times, alertar o usuário
      if (teams && teams.length > 0) {
        toast.error(
          'Não é possível excluir esta modalidade pois existem times cadastrados nela. Exclua os times primeiro.'
        );
        return;
      }

      // Se não houver times, prosseguir com a exclusão
      if (!window.confirm('Tem certeza que deseja excluir esta modalidade?')) return;

      const { error } = await supabase
        .from('modalities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Modalidade excluída com sucesso');
      fetchModalities();
    } catch (error) {
      console.error('Erro ao excluir modalidade:', error);
      toast.error('Erro ao excluir modalidade');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 dark:border-green-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Modalidades Esportivas
        </h2>
        <button
          onClick={handleAddModality}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Modalidade
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {modalities.map((modality) => (
          <div
            key={modality.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
          >
            <div className="p-4 md:p-5">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {modality.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {modality.description}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>
                  {modality.is_team_sport ? 'Esporte em Equipe' : 'Esporte Individual'}
                </span>
                <span>
                  {modality.is_active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-end space-x-3">
              <button
                onClick={() => handleEditModality(modality)}
                className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Editar
              </button>
              <button
                onClick={() => handleDeleteModality(modality.id)}
                className="inline-flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      <ModalityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modality={selectedModality}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchModalities();
        }}
      />
    </div>
  );
};

export default ManageModalities;