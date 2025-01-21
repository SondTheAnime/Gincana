import { useState } from 'react';
import { Match } from './types';
import { CalendarHeader } from './components/CalendarHeader';
import { GameCard } from './components/GameCard';
import { EditGameModal } from './components/EditGameModal';
import { useCalendar } from './hooks/useCalendar';

export function ManageCalendar() {
  const {
    loading,
    selectedMonth,
    groupedMatches,
    teams,
    sports,
    locations,
    categories,
    players,
    loadingPlayers,
    setSelectedMonth,
    setFilters,
    startMatch,
    updateMatch,
    fetchPlayers,
  } = useCalendar();

  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <CalendarHeader
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onFilterChange={setFilters}
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400" />
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedMatches).map(([date, matches]) => (
            <div key={date}>
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                {new Date(date).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.map((match) => (
                  <GameCard
                    key={match.id}
                    match={match}
                    onEdit={setEditingMatch}
                    onStart={startMatch}
                  />
                ))}
              </div>
            </div>
          ))}

          {Object.keys(groupedMatches).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum jogo encontrado para este período.
              </p>
            </div>
          )}
        </div>
      )}

      <EditGameModal
        match={editingMatch}
        teams={teams}
        sports={sports}
        locations={locations}
        categories={categories}
        players={players}
        loadingPlayers={loadingPlayers}
        onClose={() => setEditingMatch(null)}
        onSave={(match) => {
          updateMatch(match);
          setEditingMatch(null);
        }}
        onFetchPlayers={fetchPlayers}
      />
    </div>
  );
} 