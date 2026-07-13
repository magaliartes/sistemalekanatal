import { supabase } from '@/lib/supabase/supabase';

export async function listarClientes() { 
  const { data, error } = await supabase 
  .from('clientes')
  .select('*') 
  
  .order('nome');
  
  if (error) throw error;

  return data;

}