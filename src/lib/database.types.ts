export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string
          name: string
          modality: string
          category: 'Masculino' | 'Feminino' | 'Misto'
          class: string
          created_at: string
          updated_at: string
          coach: string | null
          assistant_coach: string | null
          home_court: string | null
          formation: string | null
        }
        Insert: {
          id?: string
          name: string
          modality: string
          category: 'Masculino' | 'Feminino' | 'Misto'
          class: string
          created_at?: string
          updated_at?: string
          coach?: string | null
          assistant_coach?: string | null
          home_court?: string | null
          formation?: string | null
        }
        Update: {
          id?: string
          name?: string
          modality?: string
          category?: 'Masculino' | 'Feminino' | 'Misto'
          class?: string
          created_at?: string
          updated_at?: string
          coach?: string | null
          assistant_coach?: string | null
          home_court?: string | null
          formation?: string | null
        }
      }

      // ... suas tabelas existentes ...

      team_requests: {
        Row: {
          id: string
          nome_tecnico: string
          turma: string
          modalidade: string
          telefone: string
          status: 'pendente' | 'aprovado' | 'rejeitado'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome_tecnico: string
          turma: string
          modalidade: string
          telefone: string
          status?: 'pendente' | 'aprovado' | 'rejeitado'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome_tecnico?: string
          turma?: string
          modalidade?: string
          telefone?: string
          status?: 'pendente' | 'aprovado' | 'rejeitado'
          created_at?: string
          updated_at?: string
        }
      }

      player_requests: {
        Row: {
          id: string
          nome_jogador: string
          turma: string
          genero: string
          numero_camisa: string
          modalidade: string
          posicao: string | null
          empunhadura: string | null
          estilo_jogo: string | null
          lateralidade: string | null
          telefone: string
          status: 'pendente' | 'aprovado' | 'rejeitado'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome_jogador: string
          turma: string
          genero: string
          numero_camisa: string
          modalidade: string
          posicao?: string | null
          empunhadura?: string | null
          estilo_jogo?: string | null
          lateralidade?: string | null
          telefone: string
          status?: 'pendente' | 'aprovado' | 'rejeitado'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome_jogador?: string
          turma?: string
          genero?: string
          numero_camisa?: string
          modalidade?: string
          posicao?: string | null
          empunhadura?: string | null
          estilo_jogo?: string | null
          lateralidade?: string | null
          telefone?: string
          status?: 'pendente' | 'aprovado' | 'rejeitado'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 