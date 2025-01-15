import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import LiveGames from '../components/home/LiveGames/LiveGames';
import UpcomingMatches from '../components/home/UpcomingMatches';
import Home from '../pages/Home';
import PrivateRoute from '../components/admin/PrivateRoute';
import Inscricao from '../pages/Inscricao';
import InscricaoTime from '../pages/InscricaoTime';
import InscricaoJogador from '../pages/InscricaoJogador';
import { Root } from '../components/Root';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
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
        path: 'inscricao',
        children: [
          {
            index: true,
            element: <Inscricao />,
          },
          {
            path: 'time',
            element: <InscricaoTime />,
          },
          {
            path: 'jogador',
            element: <InscricaoJogador />,
          },
        ],
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