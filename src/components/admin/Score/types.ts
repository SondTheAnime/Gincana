export interface Game {
  id: number
  sport: string
  teamA: string
  teamB: string
  scoreA: number
  scoreB: number
  time: string
  period: string
  location: string
  category: string
  isLive: boolean
}

export interface GameEvent {
  id: number
  gameId: number
  type: 'goal' | 'assist' | 'yellowCard' | 'redCard'
  playerId: number
  playerName: string
  team: 'A' | 'B'
  timestamp: string
  minute: number
}

export interface Player {
  id: number
  name: string
  number: number
  team: string
} 