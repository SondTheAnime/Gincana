import { X, User, Star } from 'lucide-react';
import { FutsalPlayer } from '../../types';

interface PlayerStatsModalProps {
  player: FutsalPlayer;
  onClose: () => void;
}

const PlayerStatsModal = ({ player, onClose }: PlayerStatsModalProps) => {
  const stats = [
    { label: 'Gols', value: player.stats.goals },
    { label: 'Assistências', value: player.stats.assists },
    { label: 'Defesas', value: player.stats.saves },
    { label: 'Clean Sheets', value: player.stats.clean_sheets },
    { label: 'Minutos Jogados', value: player.stats.minutes_played },
    { label: 'Faltas Cometidas', value: player.stats.fouls_committed },
    { label: 'Faltas Sofridas', value: player.stats.fouls_suffered },
    { label: 'Cartões Amarelos', value: player.stats.yellow_cards },
    { label: 'Cartões Vermelhos', value: player.stats.red_cards }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 dark:bg-green-800 h-16 w-16 rounded-full flex items-center justify-center overflow-hidden relative">
              {player.photo ? (
                <img 
                  src={player.photo} 
                  alt={player.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-green-600 dark:text-green-400" />
              )}
              {player.is_captain && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                  <Star className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {player.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                #{player.number} • {player.position}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map(({ label, value }) => (
            <div key={label} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {label}
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsModal; 