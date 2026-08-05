import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('modelos_arvore')
    .select('*')
    .order('nome_modelo', { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}