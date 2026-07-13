// src/lib/services/funcionarios.ts

import { supabase } from '@/lib/supabase/supabase';

export async function listarFuncionarios() {
  const { data, error } = await supabase
    .from('funcionarios')
    .select('*')
    .order('nome');

  console.log(JSON.stringify(data, null, 2));

  if (error) throw error;

  return data;
}