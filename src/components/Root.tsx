import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export function Root() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <Navbar />
      <Outlet />
    </div>
  )
} 