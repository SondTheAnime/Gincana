import { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Trash2, Edit } from 'lucide-react';

interface Match {
  id: number;
  date: string;
  time: string;
  sport: string;
  teamA: string;
  teamB: string;
  location: string;
  category: string;
}

const ManageCalendar = () => {
  const [matches, setMatches] = useState<Match[]>([
    {
      id: 1,
      date: '2024-03-20',
      time: '14:00',
      sport: 'Futsal',
      teamA: 'Edificações',
      teamB: 'Mineração',
      location: 'Quadra Principal',
      category: 'Masculino'
    },
    {
      id: 2,
      date: '2024-03-20',
      time: '15:30',
      sport: 'Basquete',
      teamA: 'Informática',
      teamB: 'Química',
      location: 'Quadra Coberta',
      category: 'Misto'
    },
  ]);

  const [selectedMonth, setSelectedMonth] = useState<string>('2024-03');

  const handleDeleteMatch = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este jogo?')) {
      setMatches(matches.filter(match => match.id !== id));
    }
  };

  const handleEditMatch = (id: number) => {
    // TODO: Implementar edição de jogo
    console.log('Editar jogo:', id);
  };

  const filteredMatches = matches.filter(match => match.date.startsWith(selectedMonth));

  const groupedMatches = filteredMatches.reduce((groups, match) => {
    const date = match.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(match);
    return groups;
  }, {} as Record<string, Match[]>);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Calendário</h2>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full sm:w-auto rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
          >
            <option value="2024-03">Março 2024</option>
            <option value="2024-04">Abril 2024</option>
            <option value="2024-05">Maio 2024</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        {Object.entries(groupedMatches).map(([date, dayMatches]) => (
          <div key={date} className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300">
              {new Date(date).toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </h3>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {dayMatches.map(match => (
                  <div key={match.id} className="p-3 md:p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0">
                      <div className="flex items-center justify-between md:justify-start md:w-1/4 md:pr-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                            {match.time}
                          </div>
                          <div>
                            <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white">{match.sport}</p>
                            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{match.category}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 md:px-4">
                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                          <div className="flex items-center justify-center flex-1">
                            <div className="flex items-center space-x-2 md:space-x-4">
                              <div className="text-right flex-1">
                                <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white truncate max-w-[120px] md:max-w-[160px]">
                                  {match.teamA}
                                </p>
                              </div>
                              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium px-2">VS</p>
                              <div className="text-left flex-1">
                                <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white truncate max-w-[120px] md:max-w-[160px]">
                                  {match.teamB}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            <span className="truncate max-w-[150px] md:max-w-[200px]">{match.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-1 md:space-x-2 md:w-24">
                        <button
                          onClick={() => handleEditMatch(match.id)}
                          className="p-1.5 md:p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                          aria-label="Editar jogo"
                        >
                          <Edit className="h-4 w-4 md:h-5 md:w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMatch(match.id)}
                          className="p-1.5 md:p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          aria-label="Excluir jogo"
                        >
                          <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {Object.keys(groupedMatches).length === 0 && (
          <div className="text-center py-8 md:py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              Nenhum jogo encontrado para este mês
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCalendar; 