import { Users, UserPlus, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Inscricao = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const cards = [
    {
      id: 'time',
      title: 'Inscrição de Time',
      description: 'Para técnicos cadastrarem seus times na competição',
      icon: Users,
      path: '/inscricao/time',
      color: 'from-blue-500 to-blue-700'
    },
    {
      id: 'jogador',
      title: 'Inscrição de Jogador',
      description: 'Para jogadores se inscreverem em times existentes',
      icon: UserPlus,
      path: '/inscricao/jogador',
      color: 'from-green-500 to-green-700'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Inscrição
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Escolha o tipo de inscrição que deseja realizar
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {cards.map((card) => (
            <Link
              key={card.id}
              to={card.path}
              className="relative group"
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`
                h-full rounded-2xl p-8
                bg-gradient-to-br ${card.color}
                transform transition-all duration-300
                ${hoveredCard === card.id ? 'scale-105' : ''}
                hover:shadow-xl
              `}>
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                    <card.icon className="h-8 w-8 text-white" />
                  </div>
                  <ChevronRight 
                    className={`
                      h-6 w-6 text-white opacity-0 transform translate-x-0
                      transition-all duration-300
                      ${hoveredCard === card.id ? 'opacity-100 translate-x-2' : ''}
                    `}
                  />
                </div>
                <div className="mt-6">
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-white text-opacity-90">
                    {card.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Inscricao 