import React, { useState } from 'react';
import { LogIn, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (data?.user) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Email ou senha inválidos');
      console.error('Erro no login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center px-4">
      <div className="mx-auto w-full max-w-md">
        <div className="flex justify-center">
          <Shield className="h-10 w-10 md:h-12 md:w-12 text-green-700 dark:text-green-400" />
        </div>
        <h2 className="mt-4 md:mt-6 text-center text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Área Administrativa
        </h2>
        <p className="mt-2 text-center text-sm md:text-base text-gray-600 dark:text-gray-400">
          Acesso restrito para administradores do IFPA Competições
        </p>
      </div>

      <div className="mt-6 md:mt-8 mx-auto w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 py-6 md:py-8 px-4 md:px-6 lg:px-8 shadow rounded-lg">
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 rounded-md">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 text-sm md:text-base"
                  placeholder="seu.email@ifpa.edu.br"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Senha
              </label>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 text-sm md:text-base"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2.5 md:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <LogIn className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;