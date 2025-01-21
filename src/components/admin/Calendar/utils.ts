import { Match } from './types'

export function formatGameTime(time: string): string {
  const [minutes, seconds] = time.split(':')
  return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
}

export function formatMatchDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export function formatMatchTime(time: string): string {
  return time.substring(0, 5) // Remove os segundos se houver
}

export function sortMatchesByDateTime(matches: Match[]): Match[] {
  return [...matches].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })
}

export function groupMatchesByDate(matches: Match[]): Record<string, Match[]> {
  return matches.reduce((acc, match) => {
    if (!acc[match.date]) {
      acc[match.date] = []
    }
    acc[match.date].push(match)
    return acc
  }, {} as Record<string, Match[]>)
}

export function filterMatches(matches: Match[], filters: {
  sport?: string
  category?: string
  location?: string
  status?: string
}): Match[] {
  return matches.filter(match => {
    if (filters.sport && match.sport !== filters.sport) return false
    if (filters.category && match.category !== filters.category) return false
    if (filters.location && match.location !== filters.location) return false
    if (filters.status && match.status !== filters.status) return false
    return true
  })
}

export function getMonthRange(yearMonth: string) {
  const [year, month] = yearMonth.split('-')
  const startDate = new Date(Number(year), Number(month) - 1, 1)
  const endDate = new Date(Number(year), Number(month), 0)
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  }
} 