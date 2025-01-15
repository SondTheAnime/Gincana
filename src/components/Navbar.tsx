import { Trophy, LogIn, Moon, Sun, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Navbar = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin');
    }
  };

  return (
    <nav className="bg-green-700 dark:bg-gray-800 text-white shadow-lg relative z-50">
      <div className="container mx-auto px-3 lg:px-6">
        <div className="flex items-center justify-between h-14 lg:h-16">
          <Link to="/" className="flex items-center space-x-3" onClick={closeMenu}>
            <Trophy className="h-5 w-5 lg:h-6 lg:w-6" />
            <span className="font-bold text-lg lg:text-xl">IFPA Competições</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-6 lg:space-x-8 text-base">
              <Link to="/" className="hover:text-green-200 dark:hover:text-gray-300 transition-colors">Início</Link>
              <Link to="/jogos" className="hover:text-green-200 dark:hover:text-gray-300 transition-colors">Jogos</Link>
              <Link to="/calendario" className="hover:text-green-200 dark:hover:text-gray-300 transition-colors">Calendário</Link>
              <Link to="/inscricao" className="hover:text-green-200 dark:hover:text-gray-300 transition-colors">Inscrição</Link>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-green-600 dark:hover:bg-gray-700 transition-colors"
                aria-label="Alternar tema"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button 
                onClick={handleAdminClick}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-500 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md transition-colors text-sm lg:text-base"
              >
                <LogIn className="h-4 w-4 lg:h-5 lg:w-5" />
                <span>{isAuthenticated ? 'Dashboard' : 'Admin'}</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-green-600 dark:hover:bg-gray-700 transition-colors"
              aria-label="Alternar tema"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-green-600 dark:hover:bg-gray-700 transition-colors"
              aria-label="Menu principal"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-green-700 dark:bg-gray-800 shadow-lg">
          <div className="container mx-auto px-3 py-3 flex flex-col space-y-3">
            <Link 
              to="/" 
              className="hover:text-green-200 dark:hover:text-gray-300 transition-colors text-sm"
              onClick={closeMenu}
            >
              Início
            </Link>
            <Link 
              to="/jogos" 
              className="hover:text-green-200 dark:hover:text-gray-300 transition-colors text-sm"
              onClick={closeMenu}
            >
              Jogos
            </Link>
            <Link 
              to="/calendario" 
              className="hover:text-green-200 dark:hover:text-gray-300 transition-colors text-sm"
              onClick={closeMenu}
            >
              Calendário
            </Link>
            <Link 
              to="/inscricao" 
              className="hover:text-green-200 dark:hover:text-gray-300 transition-colors text-sm"
              onClick={closeMenu}
            >
              Inscrição
            </Link>
            <button 
              onClick={() => {
                handleAdminClick();
                closeMenu();
              }}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-500 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md transition-colors text-sm w-full"
            >
              <LogIn className="h-4 w-4" />
              <span>{isAuthenticated ? 'Dashboard' : 'Admin'}</span>
            </button>
          </div>
        </div>
      )}
      {/* Copyright */}
      <div className="text-center py-2 text-xs bg-green-800 dark:bg-gray-900">
        <p>© {new Date().getFullYear()} João Victor. Todos os direitos reservados.</p>
      </div>
    </nav>
  );
}

export default Navbar;