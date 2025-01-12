import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-toastify';
import { Team } from '../Teams/types';

interface AddGameProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GameFormData {
  sport: string;
  category: string;
  team_a: string;
  team_b: string;
  date: string;
  time: string;
  location: string;
}

const AddGame = ({ isOpen, onClose }: AddGameProps) => {
  const [formData, setFormData] = useState<GameFormData>({
    sport: '',
    category: '',
    team_a: '',
    team_b: '',
    date: '',
    time: '',
    location: '',
  });

  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [sports, setSports] = useState<string[]>([]);

  const categories = ['Masculino', 'Feminino', 'Misto'];
  const locations = ['Quadra Principal', 'Quadra Coberta'];

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;
        setTeams(data || []);
      } catch (error) {
        console.error('Erro ao buscar times:', error);
        toast.error('Erro ao carregar times. Tente novamente.');
      }
    };

    const fetchSports = async () => {
      try {
        const { data, error } = await supabase
          .from('modalities')
          .select('name')
          .eq('is_team_sport', true)
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        setSports(data.map(sport => sport.name));
      } catch (error) {
        console.error('Erro ao buscar modalidades:', error);
        toast.error('Erro ao carregar modalidades. Tente novamente.');
      }
    };

    fetchTeams();
    fetchSports();
  }, []);

  useEffect(() => {
    // Filtrar times baseado na modalidade e categoria selecionadas
    const filtered = teams.filter(team => 
      (!formData.sport || team.modality === formData.sport) &&
      (!formData.category || team.category === formData.category)
    );
    setFilteredTeams(filtered);
    
    // Limpar seleção de times quando mudar modalidade ou categoria
    setFormData(prev => ({
      ...prev,
      team_a: '',
      team_b: ''
    }));
  }, [formData.sport, formData.category, teams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('games')
        .insert([{
          sport: formData.sport,
          category: formData.category,
          team_a: parseInt(formData.team_a),
          team_b: parseInt(formData.team_b),
          date: formData.date,
          time: formData.time,
          location: formData.location,
          status: 'scheduled',
          score_a: 0,
          score_b: 0,
        }]);

      if (error) throw error;

      toast.success('Jogo adicionado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar jogo:', error);
      toast.error('Erro ao adicionar jogo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-6 w-full max-w-md my-4">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Adicionar Novo Jogo</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label="Fechar"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Modalidade
            </label>
            <select
              name="sport"
              value={formData.sport}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
            >
              <option value="">Selecione uma modalidade</option>
              {sports.map(sport => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Categoria
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Time A
            </label>
            <select
              name="team_a"
              value={formData.team_a}
              onChange={handleChange}
              required
              disabled={!formData.sport || !formData.category}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Selecione o primeiro time</option>
              {filteredTeams
                .filter(team => team.id.toString() !== formData.team_b)
                .map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))
              }
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Time B
            </label>
            <select
              name="team_b"
              value={formData.team_b}
              onChange={handleChange}
              required
              disabled={!formData.sport || !formData.category}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Selecione o segundo time</option>
              {filteredTeams
                .filter(team => team.id.toString() !== formData.team_a)
                .map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))
              }
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Data
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Horário
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Local
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
            >
              <option value="">Selecione o local</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 sm:space-x-3 mt-4 sm:mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adicionando...' : 'Adicionar Jogo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGame; 