import { Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-green-800 dark:bg-gray-900 text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3')"
        }}
      ></div>
      <div className="relative container mx-auto px-3 lg:px-6 py-8 md:py-16 lg:py-24">
        <div className="max-w-4xl">
          <div className="flex items-center space-x-3 mb-4 md:mb-6">
            <Trophy className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10" />
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold leading-tight">
              Competições IFPA Campus Marabá Industrial
            </h1>
          </div>
          <p className="text-sm md:text-lg lg:text-xl mb-6 md:mb-8 lg:mb-10 opacity-90 max-w-3xl">
            Acompanhe todos os jogos, resultados e calendário das competições esportivas do nosso campus.
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => navigate('/jogos')}
              className="bg-white text-green-800 dark:bg-gray-800 dark:text-white px-4 py-2.5 md:px-6 md:py-3 rounded-md font-medium text-sm md:text-base hover:bg-green-100 dark:hover:bg-gray-700 transition-colors w-full sm:w-auto text-center"
            >
              Ver Jogos
            </button>
            <button 
              onClick={() => navigate('/calendario')}
              className="border border-white px-4 py-2.5 md:px-6 md:py-3 rounded-md font-medium text-sm md:text-base hover:bg-white hover:text-green-800 dark:hover:bg-gray-800 transition-colors w-full sm:w-auto text-center"
            >
              Calendário
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;