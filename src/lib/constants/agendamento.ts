// Horário padrão de início conforme a preferência de período do cliente.
export const HORA_POR_PERIODO: Record<string, number> = {
  manha: 8,
  tarde: 13,
  noite: 18,
};

// Fallback quando não há modelo de árvore selecionado ainda.
export const DURACAO_PADRAO_MINUTOS = 60;