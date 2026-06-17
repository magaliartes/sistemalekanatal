import { supabase } from '@/lib/supabase/supabase';

export async function listarClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('ativo', true)
    .order('nome');

  if (error) throw error;

  return data;
}