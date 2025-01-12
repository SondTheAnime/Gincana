import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { supabase } from './lib/supabase';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        console.log('Conexão com Supabase estabelecida com sucesso');
      } catch (error) {
        console.error('Erro ao conectar com Supabase:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;