import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Team } from '../Teams/types';

interface AddGameProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddGame = ({ isOpen, onClose }: AddGameProps) => {
  const [formData, setFormData] = useState({
    sport: '',
    category: '',
    teamA: '',
    teamB: '',
    date: '',
    time: '',
    location: '',
  });

  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);

  const sports = ['Futsal', 'Vôlei', 'Basquete'];
  const categories = ['Masculino', 'Feminino', 'Misto'];
  const locations = ['Quadra Principal', 'Quadra Coberta'];

  // TODO: Implementar busca de times do backend
  useEffect(() => {
    // Simular busca de times
    const fetchTeams = async () => {
      // Aqui você deve implementar a chamada real para sua API
      const mockTeams: Team[] = [
        { id: 1, name: 'Time A', category: 'Masculino', modality: 'Futsal', players: [], awards: [] },
        { id: 2, name: 'Time B', category: 'Masculino', modality: 'Futsal', players: [], awards: [] },
        { id: 3, name: 'Time C', category: 'Feminino', modality: 'Vôlei', players: [], awards: [] },
        { id: 4, name: 'Time D', category: 'Feminino', modality: 'Vôlei', players: [], awards: [] },
      ];
      setTeams(mockTeams);
    };

    fetchTeams();
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
      teamA: '',
      teamB: ''
    }));
  }, [formData.sport, formData.category, teams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar lógica para adicionar jogo
    console.log('Novo jogo:', formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
              name="teamA"
              value={formData.teamA}
              onChange={handleChange}
              required
              disabled={!formData.sport || !formData.category}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Selecione o primeiro time</option>
              {filteredTeams
                .filter(team => team.id.toString() !== formData.teamB)
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
              name="teamB"
              value={formData.teamB}
              onChange={handleChange}
              required
              disabled={!formData.sport || !formData.category}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Selecione o segundo time</option>
              {filteredTeams
                .filter(team => team.id.toString() !== formData.teamA)
                .map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))
              }
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
              <option value="">Selecione um local</option>
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
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 rounded-md"
            >
              Adicionar Jogo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGame; 