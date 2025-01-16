import { z } from 'zod';

// Schema básico para validação de time
export const timeVoleiSchema = z.object({
  name: z.string().min(3, 'Nome do time deve ter pelo menos 3 caracteres'),
  category: z.enum(['Masculino', 'Feminino', 'Misto']),
  coach: z.string().min(3, 'Nome do técnico deve ter pelo menos 3 caracteres'),
  home_court: z.string().min(3, 'Nome da quadra deve ter pelo menos 3 caracteres')
});

// Schema básico para validação de jogador
export const jogadorVoleiSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  number: z.number().min(0, 'Número deve ser positivo').max(99, 'Número deve ser menor que 100'),
  position: z.enum(['Levantador', 'Oposto', 'Ponteiro', 'Central', 'Líbero'])
}); 