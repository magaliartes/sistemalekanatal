import { z } from 'zod';

export const agendamentoBaseSchema = z.object({
  cliente_id: z.string().uuid(),
  titulo: z.string(),
  descricao: z.string().max(20),
  tipo: z.enum(['montagem', 'desmontagem']),
  data_inicio: z.string().datetime(),
  data_fim: z.string().datetime(),
  status: z.enum(['agendado', 'confirmado', 'concluido', 'cancelado']).default('agendado'),
  observacoes: z.string().max(1000).optional(),
  modelo_arvore_id: z.string().uuid().optional(),
  quantidade_funcionarios: z.number().int().min(1).max(3).default(1),
  origem_arvore: z.enum(['propria', 'aluguel']).optional(),       // NOVO
  arvore_estoque_id: z.string().uuid().optional(),                 // NOVO
});

export const agendamentoSchema = agendamentoBaseSchema.refine(
  (data) => new Date(data.data_fim) > new Date(data.data_inicio),
  { message: 'Data de fim deve ser depois da data de início', path: ['data_fim'] }
);

export type AgendamentoInput = z.infer<typeof agendamentoSchema>;