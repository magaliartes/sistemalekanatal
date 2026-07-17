// src/lib/modelosArvore.ts

import { supabase } from '@/lib/supabase/supabase';

export async function listarModelosArvore() {
  const { data, error } = await supabase
    .from('modelos_arvore')
    .select('id, nome_modelo, altura')
    .order('altura');

  if (error) throw error;

  return data;
}