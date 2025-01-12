import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import LiveGames from '../components/home/LiveGames';
import UpcomingMatches from '../components/home/UpcomingMatches';
import Home from '../pages/Home';
import PrivateRoute from '../components/admin/PrivateRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'jogos',
        element: <LiveGames />,
      },
      {
        path: 'calendario',
        element: <UpcomingMatches />,
      },
      {
        path: 'admin',
        children: [
          {
            index: true,
            element: <AdminLogin />,
          },
          {
            path: 'dashboard',
            element: (
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            ),
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);