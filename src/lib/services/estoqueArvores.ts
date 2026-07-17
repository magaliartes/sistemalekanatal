// src/lib/estoqueArvores.ts

import { supabase } from '@/lib/supabase/supabase';

// Mapeia o status para uma classe de cor do badge
function getStatusColor(status: string) {
  const cores: Record<string, string> = {
    disponivel: 'badge-success',
    em_uso: 'badge-info',
    manutencao: 'badge-warning',
    descartada: 'badge-danger',
  };
  return cores[status] || 'badge-info';
}

// Mapeia o status para um texto amigável (opcional, mas ajuda na tabela)
function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    disponivel: 'Disponível',
    em_uso: 'Em Uso',
    manutencao: 'Manutenção',
    descartada: 'Descartada',
  };
  return labels[status] || status;
}

// Formata a altura para o padrão x,xx (2 casas decimais, vírgula)
function formatarAltura(altura: number | string | null) {
  if (altura === null || altura === undefined) return '-';
  
  const valor = typeof altura === 'string' ? parseFloat(altura) : altura;
  
  if (isNaN(valor)) return '-';

  return `${valor.toFixed(2).replace('.', ',')} m`;
}

export async function listarArvores() {
  const { data, error } = await supabase
    .from('arvores_estoque')
    .select(`
      *,
      modelos_arvore (
        id,
        nome_modelo,
        altura
      )
    `)
    .order('numero_patrimonio');

  if (error) throw error;

  return data.map((arvore) => ({
    ...arvore,
    modelo: arvore.modelos_arvore?.nome_modelo ?? '-',
    altura: formatarAltura(arvore.modelos_arvore?.altura),
    statusColor: getStatusColor(arvore.status),
    statusLabel: getStatusLabel(arvore.status),
  }));
}

export async function buscarArvore(id: string) {
  const { data, error } = await supabase
    .from('arvores_estoque')
    .select(`
      *,
      modelos_arvore (
        id,
        nome_modelo,
        altura
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function criarArvore(arvore: {
  modelo_id: string;
  numero_patrimonio: string;
  status: string;
  observacoes?: string;
}) {
  const { data, error } = await supabase
    .from('arvores_estoque')
    .insert(arvore)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function atualizarArvore(
  id: string,
  arvore: {
    modelo_id: string;
    numero_patrimonio: string;
    status: string;
    observacoes?: string;
  }
) {
  const { data, error } = await supabase
    .from('arvores_estoque')
    .update(arvore)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function excluirArvore(id: string) {
  const { error } = await supabase
    .from('arvores_estoque')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function listarModelosArvore() {
  const { data, error } = await supabase
    .from('modelos_arvore')
    .select('*')
    .order('nome_modelo');

  if (error) throw error;

  return data;
}