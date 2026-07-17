// src/types/index.ts
// ============================================================
// TIPOS TYPESCRIPT - SISTEMA ÁRVORES DE NATAL
// ============================================================

// ============================================================
// AUTENTICAÇÃO
// ============================================================

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  perfil: 'administrador' | 'operacional';
  ativo: boolean;
  ultimo_acesso?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface AuthState {
  usuario: Usuario | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  usuario: Usuario;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// ============================================================
// CLIENTES
// ============================================================

export interface Cliente {
  id: string;
  nome: string;
  telefone?: string;
  whatsapp?: string;
  endereco: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  cep?: string;
  latitude?: number;
  longitude?: number;
  observacoes?: string;
  preferencia_periodo?: 'manha' | 'tarde' | 'noite' | 'integral';
  horario_preferencial?: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface CreateClienteInput {
  nome: string;
  telefone?: string;
  whatsapp: string;
  endereco: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  cidade?: string;
  cep?: string;
  latitude?: number;
  longitude?: number;
  observacoes?: string;
  preferencia_periodo?: string;
  horario_preferencial?: string;
}

export interface ClienteFilters {
  bairro?: string;
  nome?: string;
  ativo?: boolean;
  periodo?: string;
}

// ============================================================
// FUNCIONÁRIOS
// ============================================================

export interface Funcionario {
  id: string;
  nome: string;
  telefone: string;
  endereco?: string;
  bairro?: string;
  cidade: string;
  cep?: string;
  latitude?: number;
  longitude?: number;
  pix?: string;
  especialidade?: string;
  ativo: boolean;
  observacoes?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface CreateFuncionarioInput {
  nome: string;
  telefone: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  cep?: string;
  latitude?: number;
  longitude?: number;
  pix?: string;
  especialidade?: string;
  observacoes?: string;
}

export interface FuncionarioBloqueio {
  id: string;
  funcionario_id: string;
  data_bloqueio: string;
  motivo?: string;
  criado_em: string;
}

export interface DisponibilidadeFuncionario {
  funcionario_id: string;
  data: string;
  disponivel: boolean;
  motivo?: string;
}

// ============================================================
// MODELOS DE ÁRVORE
// ============================================================

export interface ModeloArvore {
  id: string;
  nome_modelo: string;
  altura: number;
  complexidade: 'baixa' | 'media' | 'alta';
  tempo_montagem_1_funcionario: number; // minutos
  tempo_montagem_2_funcionarios: number;
  tempo_montagem_3_funcionarios: number;
  tempo_desmontagem: number;
  quantidade_luzes_padrao: number;
  quantidade_enfeites_padrao: number;
  valor_montagem_por_funcionario: number;
  valor_desmontagem_por_funcionario: number;
  criado_em: string;
  atualizado_em: string;
}

// ============================================================
// ESTOQUE
// ============================================================

export interface ArvoreEstoque {
  id: string;
  modelo_id: string;
  numero_patrimonio: string;
  status: 'disponivel' | 'em_uso' | 'manutencao' | 'descartada';
  observacoes?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface LuzEstoque {
  id: string;
  tipo: string;
  quantidade: number;
  quantidade_minima: number;
  status: 'disponivel' | 'em_uso' | 'danificada';
  criado_em: string;
  atualizado_em: string;
}

export interface EnfeiteEstoque {
  id: string;
  categoria: string;
  quantidade: number;
  quantidade_minima: number;
  status: 'disponivel' | 'em_uso' | 'danificada';
  criado_em: string;
  atualizado_em: string;
}

export interface AlertaEstoque {
  id: string;
  tipo: 'arvore' | 'luz' | 'enfeite';
  item_id: string;
  descricao: string;
  urgencia: 'baixa' | 'media' | 'alta';
}

// ============================================================
// SERVIÇOS
// ============================================================

export interface Servico {
  id: string;
  cliente_id: string;
  tipo_servico: 'montagem' | 'desmontagem' | 'ambos';
  data_desejada: string; // YYYY-MM-DD
  periodo_desejado?: 'manha' | 'tarde' | 'noite';
  horario_especifico?: string; // HH:MM
  arvore_aluguel: boolean;
  enfeites_aluguel: boolean;
  modelo_arvore_id?: string;
  quantidade_funcionarios: number;
  tempo_estimado?: number; // minutos
  observacoes?: string;
  status: 'aguardando' | 'confirmado' | 'agendado' | 'concluido' | 'cancelado';
  valor_total?: number;
  criado_em: string;
  atualizado_em: string;
}

export interface CreateServicoInput {
  cliente_id: string;
  tipo_servico: 'montagem' | 'desmontagem' | 'ambos';
  data_desejada: string;
  periodo_desejado?: string;
  horario_especifico?: string;
  arvore_aluguel: boolean;
  enfeites_aluguel: boolean;
  modelo_arvore_id?: string;
  quantidade_funcionarios?: number;
  observacoes?: string;
}

// ============================================================
// EQUIPES
// ============================================================

export interface Equipe {
  id: string;
  nome: string;
  ativo: boolean;
  funcionarios?: Funcionario[];
  criado_em: string;
  atualizado_em: string;
}

export interface EquipeFuncionario {
  id: string;
  equipe_id: string;
  funcionario_id: string;
  criado_em: string;
}

export interface CreateEquipeInput {
  nome: string;
  funcionario_ids: string[];
}

// ============================================================
// AGENDAMENTOS
// ============================================================

export interface Agendamento {
  id: string;
  servico_id: string;
  data_agendamento: string; // YYYY-MM-DD
  horario_inicio: string; // HH:MM
  horario_fim_estimado: string;
  equipe_id: string;
  custo_transporte_estimado: number;
  tempo_deslocamento_minutos: number;
  endereco_atendimento: string;
  latitude_atendimento?: number;
  longitude_atendimento?: number;
  status: 'pendente' | 'aprovado' | 'em_progresso' | 'concluido' | 'cancelado';
  aprovado: boolean;
  data_aprovacao?: string;
  criado_em: string;
  atualizado_em: string;

  // Relacionamentos (opcionais, quando fetch com join)
  servico?: Servico;
  cliente?: Cliente;
  equipe?: Equipe;
}

export interface CreateAgendamentoInput {
  servico_id: string;
  data_agendamento: string;
  horario_inicio: string;
  equipe_id: string;
  endereco_atendimento: string;
  latitude_atendimento?: number;
  longitude_atendimento?: number;
}

export interface AgendamentoComDetalhes extends Agendamento {
  servico: Servico;
  cliente: Cliente;
  equipe: Equipe;
  distancia_km?: number;
  //tempo_deslocamento_minutos?: number;
}

export interface OtimizacaoAgendaRequest {
  servicos_ids: string[];
  data: string;
  num_equipes: number;
}

export interface SugestaoOtimizacao {
  equipe_id?: string;
  servicos: Servico[];
  ordem_otimizada: string[]; // IDs dos serviços
  rota: RotaOtimizada;
  custo_transporte_total: number;
  tempo_total_minutos: number;
}

// ============================================================
// MAPAS E GEOLOCALIZAÇÃO
// ============================================================

export interface Coordenadas {
  latitude: number;
  longitude: number;
}

export interface Localizacao extends Coordenadas {
  endereco: string;
  bairro: string;
  cidade: string;
  cep?: string;
}

export interface RotaOtimizada {
  origem: Coordenadas;
  destino: Coordenadas;
  pontos_intermediarios: Coordenadas[];
  distancia_total_km: number;
  tempo_total_minutos: number;
  passos?: RotaPasso[];
}

export interface RotaPasso {
  inicio: Coordenadas;
  fim: Coordenadas;
  distancia_km: number;
  tempo_minutos: number;
  instrucoes: string;
}

export interface CalculoDistanciaRequest {
  origem: Coordenadas | string;
  destino: Coordenadas | string;
}

export interface CalculoDistanciaResponse {
  distancia_km: number;
  tempo_minutos: number;
  tempo_transito_minutos?: number; // São Paulo traffic
}

// ============================================================
// FINANCEIRO
// ============================================================

export interface PagamentoFuncionario {
  id: string;
  funcionario_id: string;
  servico_id: string;
  valor: number;
  tipo: 'montagem' | 'desmontagem' | 'deslocamento';
  pago: boolean;
  data_pagamento?: string;
  pix?: string;
  observacoes?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface CreatePagamentoInput {
  funcionario_id: string;
  servico_id: string;
  valor: number;
  tipo: 'montagem' | 'desmontagem' | 'deslocamento';
}

export interface ResumoPagamentoFuncionario {
  funcionario_id: string;
  funcionario_nome: string;
  funcionario_pix: string;
  valor_total: number;
  pagamentos: PagamentoFuncionario[];
  pago: boolean;
}

export interface ResumoPagamentoDia {
  data: string;
  funcionarios: ResumoPagamentoFuncionario[];
  valor_total_dia: number;
  quantidade_funcionarios: number;
}

// ============================================================
// WHATSAPP
// ============================================================

export type TipoMensagemWhatsApp =
  | 'confirmacao_cliente'
  | 'resumo_agenda_dona'
  | 'agenda_funcionario'
  | 'rota_taxista'
  | 'pagamento_funcionario'
  | 'lembrete_cliente';

export interface MensagemWhatsApp {
  tipo: TipoMensagemWhatsApp;
  destinatario: string; // Número com código país
  nome_destinatario: string;
  conteudo: string;
  agendado_para?: string; // Data/hora agendamento
}

export interface WhatsAppHistorico {
  id: string;
  tipo_mensagem: string;
  destinatario: string;
  nome_destinatario: string;
  conteudo: string;
  status: 'pendente' | 'enviado' | 'entregue' | 'lido' | 'erro';
  data_agendamento?: string;
  data_envio?: string;
  erro_mensagem?: string;
  criado_em: string;
}

// ============================================================
// RELATÓRIOS
// ============================================================

export interface RelatorioDiario {
  data: string;
  total_servicos: number;
  servicos_concluidos: number;
  servicos_pendentes: number;
  funcionarios_ativos: number;
  custo_transporte_total: number;
  receita_estimada: number;
  despesa_total: number;
  lucro: number;
}

export interface RelatorioSemanal {
  semana_inicio: string;
  semana_fim: string;
  dias: RelatorioDiario[];
  totais: {
    servicos: number;
    concluidos: number;
    receita: number;
    despesa: number;
    lucro: number;
  };
}

export interface RelatorioDesempenho {
  funcionario_id: string;
  funcionario_nome: string;
  total_servicos: number;
  valor_total_ganho: number;
  tempo_medio_servico: number;
  avaliacao_media?: number;
  taxa_conclusao: number; // %
}

// ============================================================
// RESPOSTAS API
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiPaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
}

// ============================================================
// DASHBOARD
// ============================================================

export interface DashboardData {
  data_atual: string;
  hoje: {
    total_agendamentos: number;
    confirmados: number;
    pendentes: number;
    concluidos: number;
    proximos_servicos: AgendamentoComDetalhes[];
  };
  funcionarios: {
    ativos: number;
    disponíveis_hoje: number;
  };
  financeiro: {
    custo_transporte_estimado: number;
    receita_estimada: number;
    despesa_total: number;
  };
  estoque: {
    arvores_disponiveis: number;
    luzes_estoque: number;
    enfeites_estoque: number;
    alertas: AlertaEstoque[];
  };
  serviços_pendentes: Servico[];
}

// ============================================================
// FORMULÁRIOS
// ============================================================

export interface FormErrors {
  [key: string]: string | string[];
}

export interface FormState<T> {
  values: T;
  errors: FormErrors;
  touched: { [key: string]: boolean };
  isSubmitting: boolean;
  isValid: boolean;
}

export interface ModeloArvore {
  id: string;
  nome_modelo: string;
  altura: number | null;
}

export interface EstoqueArvore {
  id: string;
  modelo_id: string;
  numero_patrimonio: string;
  status: string;
  observacoes?: string | null;

  criado_em?: string;
  atualizado_em?: string;

  modelos_arvores?: ModeloArvore;
}