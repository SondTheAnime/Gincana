import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import { X, Users } from 'lucide-react'
import { Match, Team, Player } from '../types'

interface EditGameModalProps {
  match: Match | null
  teams: Team[]
  sports: string[]
  locations: string[]
  categories: string[]
  players: Player[]
  loadingPlayers: boolean
  onClose: () => void
  onSave: (match: Match) => void
  onFetchPlayers: (teamIds: number[]) => void
}

export function EditGameModal({
  match,
  teams,
  sports,
  locations,
  categories,
  players,
  loadingPlayers,
  onClose,
  onSave,
  onFetchPlayers,
}: EditGameModalProps) {
  const [editingMatch, setEditingMatch] = useState<Match | null>(null)
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [selectedTab, setSelectedTab] = useState('info')

  useEffect(() => {
    if (match) {
      setEditingMatch(match)
      onFetchPlayers([match.team_a, match.team_b])
    }
  }, [match, onFetchPlayers])

  useEffect(() => {
    if (editingMatch) {
      const filtered = teams.filter(
        (team) =>
          (!editingMatch.sport || team.modality === editingMatch.sport) &&
          (!editingMatch.category || team.category === editingMatch.category)
      )
      setFilteredTeams(filtered)
    }
  }, [editingMatch?.sport, editingMatch?.category, teams])

  const handleChange = (field: keyof Match, value: any) => {
    if (!editingMatch) return
    setEditingMatch({ ...editingMatch, [field]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMatch) return
    onSave(editingMatch)
  }

  if (!match) return null

  const isIndividualSport = match.sport === 'Tênis de Mesa'

  return (
    <Dialog.Root open={!!match} onOpenChange={() => onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Editar Jogo
            </Dialog.Title>
            <Dialog.Close className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <Tabs.Root value={selectedTab} onValueChange={setSelectedTab}>
            <Tabs.List className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-6">
              <Tabs.Trigger
                value="info"
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === 'info'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Informações Gerais
              </Tabs.Trigger>
              {isIndividualSport && (
                <Tabs.Trigger
                  value="players"
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                    selectedTab === 'players'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Jogadores
                </Tabs.Trigger>
              )}
            </Tabs.List>

            <Tabs.Content value="info">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Modalidade
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      value={editingMatch?.sport}
                      onChange={(e) => handleChange('sport', e.target.value)}
                    >
                      <option value="">Selecione</option>
                      {sports.map((sport) => (
                        <option key={sport} value={sport}>
                          {sport}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Categoria
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      value={editingMatch?.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                    >
                      <option value="">Selecione</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time A
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      value={editingMatch?.team_a}
                      onChange={(e) => {
                        const team = teams.find((t) => t.id === Number(e.target.value))
                        handleChange('team_a', Number(e.target.value))
                        handleChange('team_a_name', team?.name || '')
                      }}
                    >
                      <option value="">Selecione</option>
                      {filteredTeams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time B
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      value={editingMatch?.team_b}
                      onChange={(e) => {
                        const team = teams.find((t) => t.id === Number(e.target.value))
                        handleChange('team_b', Number(e.target.value))
                        handleChange('team_b_name', team?.name || '')
                      }}
                    >
                      <option value="">Selecione</option>
                      {filteredTeams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Data
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      value={editingMatch?.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Horário
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      value={editingMatch?.time}
                      onChange={(e) => handleChange('time', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Local
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      value={editingMatch?.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                    >
                      <option value="">Selecione</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </Tabs.Content>

            {isIndividualSport && (
              <Tabs.Content value="players">
                <div className="space-y-6">
                  {loadingPlayers ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400" />
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                          Time A - {editingMatch?.team_a_name}
                        </h3>
                        <div className="space-y-3">
                          {players
                            .filter((player) => player.team_id === editingMatch?.team_a)
                            .map((player) => (
                              <div
                                key={player.id}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                    <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                      {player.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      Nº {player.number}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                          Time B - {editingMatch?.team_b_name}
                        </h3>
                        <div className="space-y-3">
                          {players
                            .filter((player) => player.team_id === editingMatch?.team_b)
                            .map((player) => (
                              <div
                                key={player.id}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                    <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                      {player.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      Nº {player.number}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Tabs.Content>
            )}
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
} 