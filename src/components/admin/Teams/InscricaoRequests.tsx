import { useState, useEffect } from 'react'
import { Check, X, ChevronDown, ChevronUp, Loader2, Trash2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { toast } from 'sonner'

type InscricaoTimeRequest = {
  id: string
  nomeTecnico: string
  auxiliarTecnico?: string | null
  turma: string
  modalidade: string
  genero: 'Masculino' | 'Feminino' | 'Misto'
  telefone: string
  status: 'pendente' | 'aprovado' | 'rejeitado'
  createdAt: Date
}

type InscricaoJogadorRequest = {
  id: string
  nomeJogador: string
  turma: string
  genero: string
  numeroCamisa: string
  modalidade: string
  team_id: string
  posicao?: string
  empunhadura?: string
  estiloJogo?: string
  lateralidade?: string
  telefone: string
  status: 'pendente' | 'aprovado' | 'rejeitado'
  createdAt: Date
}

const InscricaoRequests = () => {
  const [expandedTime, setExpandedTime] = useState<string | null>(null)
  const [expandedJogador, setExpandedJogador] = useState<string | null>(null)
  const [timeRequests, setTimeRequests] = useState<InscricaoTimeRequest[]>([])
  const [jogadorRequests, setJogadorRequests] = useState<InscricaoJogadorRequest[]>([])
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setIsLoading(true)

      // Buscar solicitações de times
      const { data: timeData, error: timeError } = await supabase
        .from('team_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (timeError) throw timeError

      // Buscar solicitações de jogadores
      const { data: playerData, error: playerError } = await supabase
        .from('player_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (playerError) throw playerError

      // Converter os dados para o formato correto
      setTimeRequests(timeData.map(item => ({
        id: item.id,
        nomeTecnico: item.nome_tecnico,
        auxiliarTecnico: item.auxiliar_tecnico,
        turma: item.turma,
        modalidade: item.modalidade,
        genero: item.genero,
        telefone: item.telefone,
        status: item.status,
        createdAt: new Date(item.created_at)
      })))

      setJogadorRequests(playerData.map(item => ({
        id: item.id,
        nomeJogador: item.nome_jogador,
        turma: item.turma,
        genero: item.genero,
        numeroCamisa: item.numero_camisa,
        modalidade: item.modalidade,
        team_id: item.team_id,
        posicao: item.posicao,
        empunhadura: item.empunhadura,
        estiloJogo: item.estilo_jogo,
        lateralidade: item.lateralidade,
        telefone: item.telefone,
        status: item.status,
        createdAt: new Date(item.created_at)
      })))
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error)
      toast.error('Erro ao carregar solicitações')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTimeAction = async (id: string, action: 'aprovar' | 'rejeitar') => {
    try {
      setLoadingAction(id)
      const request = timeRequests.find(r => r.id === id)
      
      if (!request) {
        throw new Error('Solicitação não encontrada')
      }

      if (action === 'aprovar') {
        // Verificar se a modalidade existe
        const { data: modalityExists, error: modalityError } = await supabase
          .from('modalities')
          .select('name')
          .eq('name', request.modalidade)
          .single()

        if (modalityError || !modalityExists) {
          // Se a modalidade não existe, criar
          const { error: createModalityError } = await supabase
            .from('modalities')
            .insert({ 
              name: request.modalidade,
              description: `Modalidade ${request.modalidade} da Gincana`,
              is_active: true,
              is_team_sport: true
            })

          if (createModalityError) throw createModalityError
        }

        // Criar o time no banco
        const { error: createError } = await supabase
          .from('teams')
          .insert({
            name: `${request.turma}`,
            modality: request.modalidade,
            category: request.genero,
            turma: request.turma,
            coach: request.nomeTecnico,
            assistant_coach: request.auxiliarTecnico,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (createError) {
          console.error('Erro ao criar time:', createError)
          throw createError
        }
      }

      if (action === 'rejeitar') {
        // Se for rejeitar, deletar a solicitação
        const { error: deleteError } = await supabase
          .from('team_requests')
          .delete()
          .eq('id', id)

        if (deleteError) {
          console.error('Erro ao deletar solicitação:', deleteError)
          throw deleteError
        }

        // Atualizar estado local
        setTimeRequests(prev => prev.filter(request => request.id !== id))
      } else {
        // Se for aprovar, atualizar o status
        const { error: updateError } = await supabase
          .from('team_requests')
          .update({ 
            status: 'aprovado',
            updated_at: new Date().toISOString()
          })
          .eq('id', id)

        if (updateError) {
          console.error('Erro ao atualizar solicitação:', updateError)
          throw updateError
        }
      }

      // Atualizar estado local
      if (action === 'rejeitar') {
        setTimeRequests(prev => prev.filter(request => request.id !== id))
      } else {
        setTimeRequests(prev =>
          prev.map(request =>
            request.id === id
              ? { ...request, status: 'aprovado' }
              : request
          )
        )
      }

      toast.success(
        action === 'aprovar' 
          ? 'Time aprovado com sucesso!' 
          : 'Solicitação rejeitada'
      )
    } catch (error) {
      console.error('Erro ao processar solicitação:', error)
      toast.error('Erro ao processar solicitação. Tente novamente.')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleJogadorAction = async (id: string, action: 'aprovar' | 'rejeitar') => {
    try {
      setLoadingAction(id)
      const request = jogadorRequests.find(r => r.id === id)
      
      if (!request) {
        throw new Error('Solicitação não encontrada')
      }

      if (action === 'aprovar') {
        // Criar o jogador no banco
        const { error: createError } = await supabase
          .from('players')
          .insert({
            name: request.nomeJogador,
            number: parseInt(request.numeroCamisa),
            team_id: request.team_id,
            photo: null, // Campo opcional
            is_starter: false, // Valor inicial
            is_captain: false, // Valor inicial
            goals: 0, // Valor inicial para vôlei (pontos)
            yellow_cards: 0, // Valor inicial
            red_cards: 0, // Valor inicial
            position: request.posicao || null,
            stats: null, // Campo opcional para estatísticas
            style: request.estiloJogo || null,
            grip: request.empunhadura || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (createError) {
          console.error('Erro ao criar jogador:', createError)
          throw createError
        }

        // Atualizar status da solicitação
        const { error: updateError } = await supabase
          .from('player_requests')
          .update({ 
            status: 'aprovado',
            updated_at: new Date().toISOString()
          })
          .eq('id', id)

        if (updateError) {
          console.error('Erro ao atualizar solicitação:', updateError)
          throw updateError
        }
      } else {
        // Se for rejeitar, deletar a solicitação
        const { error: deleteError } = await supabase
          .from('player_requests')
          .delete()
          .eq('id', id)

        if (deleteError) {
          console.error('Erro ao deletar solicitação:', deleteError)
          throw deleteError
        }
      }

      // Atualizar estado local
      if (action === 'rejeitar') {
        setJogadorRequests(prev => prev.filter(request => request.id !== id))
      } else {
        setJogadorRequests(prev =>
          prev.map(request =>
            request.id === id
              ? { ...request, status: 'aprovado' }
              : request
          )
        )
      }

      toast.success(
        action === 'aprovar' 
          ? 'Jogador aprovado com sucesso!' 
          : 'Solicitação rejeitada'
      )
    } catch (error) {
      console.error('Erro ao processar solicitação:', error)
      toast.error('Erro ao processar solicitação. Tente novamente.')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleDeleteTimeRequest = async (id: string) => {
    try {
      setLoadingAction(id)
      
      const { error } = await supabase
        .from('team_requests')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTimeRequests(prev => prev.filter(request => request.id !== id))
      toast.success('Solicitação excluída com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir solicitação:', error)
      toast.error('Erro ao excluir solicitação')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleDeleteJogadorRequest = async (id: string) => {
    try {
      setLoadingAction(id)
      
      const { error } = await supabase
        .from('player_requests')
        .delete()
        .eq('id', id)

      if (error) throw error

      setJogadorRequests(prev => prev.filter(request => request.id !== id))
      toast.success('Solicitação excluída com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir solicitação:', error)
      toast.error('Erro ao excluir solicitação')
    } finally {
      setLoadingAction(null)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className="space-y-6">
      {/* Solicitações de Times */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Solicitações de Times
        </h2>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : timeRequests.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Nenhuma solicitação de time encontrada
            </p>
          ) : (
            timeRequests.map(request => (
              <div
                key={request.id}
                className={`
                  bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden
                  border-l-4 transition-colors
                  ${
                    request.status === 'pendente'
                      ? 'border-yellow-500'
                      : request.status === 'aprovado'
                      ? 'border-green-500'
                      : 'border-red-500'
                  }
                `}
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() =>
                    setExpandedTime(expandedTime === request.id ? null : request.id)
                  }
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {request.nomeTecnico}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {request.modalidade} - {request.turma} - {request.genero}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {request.status === 'pendente' && (
                        <>
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              handleTimeAction(request.id, 'aprovar')
                            }}
                            disabled={loadingAction === request.id}
                            className={`
                              p-1 rounded-full text-green-600 
                              hover:bg-green-100 dark:hover:bg-green-900
                              disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                          >
                            {loadingAction === request.id ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Check className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              handleTimeAction(request.id, 'rejeitar')
                            }}
                            disabled={loadingAction === request.id}
                            className={`
                              p-1 rounded-full text-red-600 
                              hover:bg-red-100 dark:hover:bg-red-900
                              disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          if (window.confirm('Tem certeza que deseja excluir esta solicitação?')) {
                            handleDeleteTimeRequest(request.id)
                          }
                        }}
                        disabled={loadingAction === request.id}
                        className={`
                          p-1 rounded-full text-gray-600 
                          hover:bg-gray-100 dark:hover:bg-gray-700
                          disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                        title="Excluir solicitação"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      {expandedTime === request.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                {expandedTime === request.id && (
                  <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold">Telefone:</p>
                        <p>{request.telefone}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Gênero do Time:</p>
                        <p>{request.genero}</p>
                      </div>
                      {request.auxiliarTecnico && (
                        <div>
                          <p className="font-semibold">Auxiliar Técnico:</p>
                          <p>{request.auxiliarTecnico}</p>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">Data da Solicitação:</p>
                        <p>{formatDate(request.createdAt)}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Status:</p>
                        <p className={`
                          ${request.status === 'pendente' ? 'text-yellow-500' : ''}
                          ${request.status === 'aprovado' ? 'text-green-500' : ''}
                          ${request.status === 'rejeitado' ? 'text-red-500' : ''}
                        `}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Solicitações de Jogadores */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Solicitações de Jogadores
        </h2>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : jogadorRequests.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Nenhuma solicitação de jogador encontrada
            </p>
          ) : (
            jogadorRequests.map(request => (
              <div
                key={request.id}
                className={`
                  bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden
                  border-l-4 transition-colors
                  ${
                    request.status === 'pendente'
                      ? 'border-yellow-500'
                      : request.status === 'aprovado'
                      ? 'border-green-500'
                      : 'border-red-500'
                  }
                `}
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() =>
                    setExpandedJogador(
                      expandedJogador === request.id ? null : request.id
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {request.nomeJogador}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {request.modalidade} - {request.turma} - Camisa #{request.numeroCamisa}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {request.status === 'pendente' && (
                        <>
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              handleJogadorAction(request.id, 'aprovar')
                            }}
                            disabled={loadingAction === request.id}
                            className={`
                              p-1 rounded-full text-green-600 
                              hover:bg-green-100 dark:hover:bg-green-900
                              disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              handleJogadorAction(request.id, 'rejeitar')
                            }}
                            disabled={loadingAction === request.id}
                            className={`
                              p-1 rounded-full text-red-600 
                              hover:bg-red-100 dark:hover:bg-red-900
                              disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          if (window.confirm('Tem certeza que deseja excluir esta solicitação?')) {
                            handleDeleteJogadorRequest(request.id)
                          }
                        }}
                        disabled={loadingAction === request.id}
                        className={`
                          p-1 rounded-full text-gray-600 
                          hover:bg-gray-100 dark:hover:bg-gray-700
                          disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                        title="Excluir solicitação"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      {expandedJogador === request.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                {expandedJogador === request.id && (
                  <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold">Gênero:</p>
                        <p>{request.genero}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Telefone:</p>
                        <p>{request.telefone}</p>
                      </div>
                      {request.modalidade === 'Vôlei' && request.posicao && (
                        <div>
                          <p className="font-semibold">Posição:</p>
                          <p>{request.posicao}</p>
                        </div>
                      )}
                      {request.modalidade === 'Tênis de Mesa' && (
                        <>
                          <div>
                            <p className="font-semibold">Empunhadura:</p>
                            <p>{request.empunhadura}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Estilo de Jogo:</p>
                            <p>{request.estiloJogo}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Lateralidade:</p>
                            <p>{request.lateralidade}</p>
                          </div>
                        </>
                      )}
                      <div>
                        <p className="font-semibold">Data da Solicitação:</p>
                        <p>{formatDate(request.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default InscricaoRequests 