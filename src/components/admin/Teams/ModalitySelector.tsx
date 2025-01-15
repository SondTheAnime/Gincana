import { useState, useEffect } from 'react';
import { Modality } from './types';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-toastify';
import { Volleyball } from 'lucide-react';
import ManageFutsalTeams from './modalities/Futsal/ManageFutsalTeams';
import ManageVoleiTeams from './modalities/Volei/ManageVoleiTeams';
import ManageTeams from './ManageTeams';

const ModalitySelector = () => {
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [selectedModality, setSelectedModality] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModalities();
  }, []);

  const fetchModalities = async () => {
    try {
      const { data, error } = await supabase
        .from('modalities')
        .select('*')
        .eq('is_team_sport', true)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      setModalities(data || []);
    } catch (error) {
      console.error('Erro ao buscar modalidades:', error);
      toast.error('Erro ao carregar modalidades. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalitySelect = (modalityName: string) => {
    setSelectedModality(modalityName);
  };

  const handleBack = () => {
    setSelectedModality(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (selectedModality) {
    switch (selectedModality) {
      case 'Futsal':
        return (
          <div>
            <button
              onClick={handleBack}
              className="mb-4 flex items-center space-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Voltar para Modalidades</span>
            </button>
            <ManageFutsalTeams />
          </div>
        );
      case 'Volei':
        return (
          <div>
            <button
              onClick={handleBack}
              className="mb-4 flex items-center space-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Voltar para Modalidades</span>
            </button>
            <ManageVoleiTeams />
          </div>
        );
      default:
        return (
          <div>
            <button
              onClick={handleBack}
              className="mb-4 flex items-center space-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Voltar para Modalidades</span>
            </button>
            <ManageTeams modalityFilter={selectedModality} />
          </div>
        );
    }
  }
  
  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
        Selecione uma Modalidade
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modalities.map((modality) => (
          <button
            key={modality.id}
            onClick={() => handleModalitySelect(modality.name)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-left space-y-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-4">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                  {modality.name === 'Volei' ? (
                    <Volleyball />
                  ) : (
                    <img
                    src={modality.icon}
                    alt={modality.name}
                    className="w-6 h-6"
                    />
                  )}
                </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {modality.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {modality.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModalitySelector;