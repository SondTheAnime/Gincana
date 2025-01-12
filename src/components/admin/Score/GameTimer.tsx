import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

interface GameTimerProps {
  initialTime?: string
  onTimeUpdate: (time: string) => void
}

const GameTimer = ({ initialTime = '00:00', onTimeUpdate }: GameTimerProps) => {
  const [time, setTime] = useState(() => {
    const [minutes, seconds] = initialTime.split(':').map(Number)
    return minutes * 60 + seconds
  })
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1
          const minutes = Math.floor(newTime / 60)
          const seconds = newTime % 60
          const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          onTimeUpdate(timeString)
          return newTime
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning, onTimeUpdate])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setTime(0)
    setIsRunning(false)
    onTimeUpdate('00:00')
  }

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center justify-center space-x-2 sm:space-x-4">
      <div className="text-2xl sm:text-3xl font-mono font-bold text-gray-900 dark:text-white">
        {formatTime(time)}
      </div>
      
      <div className="flex space-x-1 sm:space-x-2">
        <button
          onClick={toggleTimer}
          className="p-1.5 sm:p-2 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
        >
          {isRunning ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
        </button>
        
        <button
          onClick={resetTimer}
          className="p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </div>
  )
}

export default GameTimer 