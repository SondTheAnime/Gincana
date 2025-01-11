import { useState } from 'react';
import { Activity, Filter, Clock, MapPin } from 'lucide-react';

const LiveGames = () => {
  const [selectedSport, setSelectedSport] = useState<string>('all');

  const liveGames = [
    {
      id: 1,
      sport: 'Futsal',
      teamA: 'Informática',
      teamB: 'Automação',
      scoreA: 2,
      scoreB: 1,
      time: '25:13',
      period: '2º Tempo',
      location: 'Quadra Principal',
      category: 'Masculino',
      highlights: [
        'Gol - João (INF) - 15:20',
        'Cartão Amarelo - Pedro (MEC) - 18:45',
      ],
    },
    {
      id: 2,
      sport: 'Vôlei',
      teamA: 'Controle',
      teamB: 'Eletromecanica',
      scoreA: 15,
      scoreB: 12,
      time: '-',
      period: '2º Set',
      location: 'Quadra Coberta',
      category: 'Feminino',
      highlights: ['Ponto - Ana (QUI) - Ace', 'Tempo técnico pedido por ELE'],
    },
    {
      id: 3,
      sport: 'Basquete',
      teamA: 'Edificações',
      teamB: 'Eletromecanica',
      scoreA: 45,
      scoreB: 42,
      time: '05:22',
      period: '3º Quarto',
      location: 'Quadra Principal',
      category: 'Misto',
      highlights: ['Cesta de 3 - Maria (EDI)', 'Falta - Carlos (MIN)'],
    },
  ];

  const sports = ['Futsal', 'Vôlei', 'Basquete'];

  const filteredGames =
    selectedSport === 'all'
      ? liveGames
      : liveGames.filter((game) => game.sport === selectedSport);

  return (
    <div className="container mx-auto px-3 lg:px-6 py-4 md:py-8 lg:py-12">
      <div className="flex flex-col space-y-3 mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="h-5 w-5 md:h-6 md:w-6 text-red-500" />
          <h2 className="text-lg md:text-2xl font-bold dark:text-white">Jogos Ao Vivo</h2>
          <span className="animate-pulse flex items-center ml-2">
            <span className="h-2 w-2 md:h-3 md:w-3 bg-red-500 rounded-full mr-1"></span>
            <span className="text-xs md:text-sm font-medium text-red-500">AO VIVO</span>
          </span>
        </div>
        <div className="relative w-full md:w-64">
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-8 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
          >
            <option value="all">Todas Modalidades</option>
            {sports.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
          <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="grid gap-3 md:gap-4 lg:gap-6 md:grid-cols-2">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-red-500"
          >
            <div className="p-3 md:p-4 lg:p-6">
              <div className="flex flex-col space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <span className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
                      {game.sport}
                    </span>
                    <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">•</span>
                    <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{game.category}</span>
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <span className="animate-pulse text-red-500">●</span>
                    <span className="text-xs md:text-sm font-medium text-red-500">AO VIVO</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <p className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-1 truncate max-w-[120px] md:max-w-[160px] mx-auto">
                      {game.teamA}
                    </p>
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-red-600">
                      {game.scoreA}
                    </p>
                  </div>
                  <div className="text-center px-2 md:px-4">
                    <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-300">
                      {game.period}
                    </p>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      <Clock className="h-3 w-3 md:h-4 md:w-4 text-gray-400 dark:text-gray-300" />
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-300">{game.time}</p>
                    </div>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-1 truncate max-w-[120px] md:max-w-[160px] mx-auto">
                      {game.teamB}
                    </p>
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-red-600">
                      {game.scoreB}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-2 md:pt-4">
                  <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm text-gray-500 dark:text-gray-300 mb-2">
                    <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                    <span>{game.location}</span>
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <p className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200">
                      Últimos Lances:
                    </p>
                    {game.highlights.map((highlight, index) => (
                      <p
                        key={index}
                        className="text-xs md:text-sm text-gray-600 dark:text-gray-300 pl-2 md:pl-3 border-l border-red-200 dark:border-red-400"
                      >
                        {highlight}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-6 md:py-8 lg:py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <Activity className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-gray-400 dark:text-gray-300 mx-auto mb-2 md:mb-4" />
          <p className="text-sm md:text-base lg:text-lg text-gray-500 dark:text-gray-300">
            Nenhum jogo ao vivo no momento
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveGames;
