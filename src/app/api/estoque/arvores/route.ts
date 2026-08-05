import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const modeloId = searchParams.get('modelo_id');
  const status = searchParams.get('status');

  let query = supabase
    .from('arvores_estoque')
    .select('*, modelos_arvore(nome_modelo)')
    .order('numero_patrimonio', { ascending: true });

  if (modeloId) query = query.eq('modelo_id', modeloId);
  if (status) query = query.eq('status', status);

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('arvores_estoque')
      .insert([
        {
          numero_patrimonio: body.numero_patrimonio,
          modelo_id: body.modelo_id,
          status: body.status,
          observacoes: body.observacoes,
        },
      ])
      .select();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}