import { useState } from 'react';
import { Calendar, Filter, ChevronDown } from 'lucide-react';

const UpcomingMatches = () => {
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('2024-03');

  const matches = [
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
    {
      id: 3,
      date: '2024-03-21',
      time: '13:00',
      sport: 'Vôlei',
      teamA: 'Mecânica',
      teamB: 'Eletrotécnica',
      location: 'Quadra Principal',
      category: 'Feminino'
    },
    {
      id: 4,
      date: '2024-03-25',
      time: '14:00',
      sport: 'Futsal',
      teamA: 'Química',
      teamB: 'Edificações',
      location: 'Quadra Principal',
      category: 'Feminino'
    }
  ];

  const sports = ['Futsal', 'Basquete', 'Vôlei'];
  
  const filteredMatches = matches.filter(match => {
    if (selectedSport !== 'all' && match.sport !== selectedSport) return false;
    if (!match.date.startsWith(selectedMonth)) return false;
    return true;
  });

  const groupedMatches = filteredMatches.reduce((groups, match) => {
    const date = match.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(match);
    return groups;
  }, {} as Record<string, typeof matches>);

  return (
    <div className="container mx-auto px-3 lg:px-6 py-4 md:py-8 lg:py-12">
      <div className="flex flex-col space-y-3 mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
          <h2 className="text-lg md:text-2xl font-bold dark:text-white">Calendário de Jogos</h2>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <div className="relative w-full md:w-48">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-8 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white"
            >
              <option value="2024-03">Março 2024</option>
              <option value="2024-04">Abril 2024</option>
              <option value="2024-05">Maio 2024</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div className="relative w-full md:w-48">
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-8 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white"
            >
              <option value="all">Todas Modalidades</option>
              {sports.map(sport => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {Object.entries(groupedMatches).map(([date, dayMatches]) => (
        <div key={date} className="mb-6">
          <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
            {new Date(date).toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {dayMatches.map(match => (
                <div key={match.id} className="p-3 md:p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                    <div className="flex items-center justify-between md:w-1/3">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                          {match.time}
                        </div>
                        <div>
                          <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white">{match.sport}</p>
                          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{match.category}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center md:w-1/3">
                      <div className="flex items-center space-x-3 md:space-x-6">
                        <div className="text-right flex-1">
                          <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white truncate max-w-[120px] md:max-w-[160px]">{match.teamA}</p>
                        </div>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium px-2">VS</p>
                        <div className="text-left flex-1">
                          <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white truncate max-w-[120px] md:max-w-[160px]">{match.teamB}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 text-right md:w-1/3 md:pl-4">
                      {match.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {Object.keys(groupedMatches).length === 0 && (
        <div className="text-center py-6 md:py-8 lg:py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <Calendar className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-gray-400 dark:text-gray-300 mx-auto mb-2 md:mb-4" />
          <p className="text-sm md:text-base lg:text-lg text-gray-500 dark:text-gray-300">
            Nenhum jogo encontrado para os filtros selecionados
          </p>
        </div>
      )}
    </div>
  );
}

export default UpcomingMatches;