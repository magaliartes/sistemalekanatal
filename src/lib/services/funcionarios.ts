// src/lib/services/funcionarios.ts

import { supabase } from '@/lib/supabase/supabase';

export async function listarFuncionarios() {
  const { data, error } = await supabase
    .from('funcionarios')
    .select('*')
    .order('nome');

  if (error) throw error;

  return data;
}