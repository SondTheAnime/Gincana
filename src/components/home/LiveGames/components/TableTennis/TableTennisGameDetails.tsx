import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import { X } from 'lucide-react'
import { Game } from '../../types'
import { TableTennisPlayerStats } from './TableTennisPlayerStats'
import { TableTennisScoreboard } from './TableTennisScoreboard'

interface TableTennisGameDetailsProps {
  game: Game
  onClose: () => void
}

export const TableTennisGameDetails = ({ game, onClose }: TableTennisGameDetailsProps) => {
  const config = game.config

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 p-3 sm:p-6 rounded-lg shadow-xl w-[95vw] sm:w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
              Detalhes da Partida
            </Dialog.Title>
            <Dialog.Close className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Dialog.Close>
          </div>

          <Tabs.Root defaultValue="scoreboard">
            <Tabs.List className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-4 sm:mb-6 overflow-x-auto">
              <Tabs.Trigger
                value="scoreboard"
                className="pb-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700 dark:data-[state=inactive]:text-gray-400 dark:hover:text-gray-300"
              >
                Placar
              </Tabs.Trigger>
              <Tabs.Trigger
                value="stats"
                className="pb-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700 dark:data-[state=inactive]:text-gray-400 dark:hover:text-gray-300"
              >
                Estatísticas
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="scoreboard">
              <TableTennisScoreboard game={game} />
            </Tabs.Content>

            <Tabs.Content value="stats">
              <TableTennisPlayerStats game={game} />
            </Tabs.Content>
          </Tabs.Root>

          {/* Informações do Jogo */}
          <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Duração</div>
              <div className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                {game.game_time}
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Sets</div>
              <div className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                Melhor de {config.total_sets}
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Local</div>
              <div className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                {game.location}
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Categoria</div>
              <div className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                {game.category}
              </div>
            </div>
          </div>

          {/* Highlights */}
          {(game.highlights?.length ?? 0) > 0 && (
            <div className="mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                Momentos Importantes
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {game.highlights?.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {new Date(event.created_at).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
                      {event.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
} 