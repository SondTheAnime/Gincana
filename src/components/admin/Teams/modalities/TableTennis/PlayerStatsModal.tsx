import { X } from 'lucide-react';
import { TableTennisPlayer } from './types';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface PlayerStatsModalProps {
  player: TableTennisPlayer;
  onClose: () => void;
}

const PlayerStatsModal = ({ player, onClose }: PlayerStatsModalProps) => {
  const getWinRate = () => {
    const { matches_won, matches_played } = player.stats;
    if (!matches_played) return 0;
    return ((matches_won / matches_played) * 100).toFixed(1);
  };

  const getPointsAverage = () => {
    const { points_won, matches_played } = player.stats;
    if (!matches_played) return 0;
    return (points_won / matches_played).toFixed(1);
  };

  const getSetsAverage = () => {
    const { sets_won, matches_played } = player.stats;
    if (!matches_played) return 0;
    return (sets_won / matches_played).toFixed(1);
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800 sm:max-w-lg">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none dark:hover:text-gray-300"
                    onClick={onClose}
                  >
                    <span className="sr-only">Fechar</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Estatísticas do Jogador
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {player.name} - #{player.number}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="col-span-1 sm:col-span-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Desempenho Geral
                      </h4>
                      <div className="mt-2 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {getWinRate()}%
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Win Rate
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {getPointsAverage()}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Pts/Partida
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {getSetsAverage()}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Sets/Partida
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Partidas
                      </h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Jogadas
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {player.stats.matches_played}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Vitórias
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {player.stats.matches_won}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Derrotas
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {player.stats.matches_lost}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Sets
                      </h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Vencidos
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {player.stats.sets_won}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Perdidos
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {player.stats.sets_lost}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Pontos
                      </h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Ganhos
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {player.stats.points_won}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Perdidos
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {player.stats.points_lost}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Detalhes Técnicos
                      </h4>
                      <div className="mt-2 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {player.stats.aces}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Aces
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {player.stats.winners}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Winners
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {player.stats.unforced_errors}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Erros
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PlayerStatsModal;
