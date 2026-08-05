import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { agendamentoBaseSchema } from '@/lib/schemas/agendamentos';

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const searchParams = request.nextUrl.searchParams;
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  let query = supabase
    .from('agendamentos')
    .select('*, clientes(nome, telefone)')
    .order('data_inicio', { ascending: true });

  if (start) query = query.gte('data_inicio', start);
  if (end) query = query.lte('data_fim', end);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const body = await request.json();

  const parsed = agendamentoBaseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('agendamentos')
    .insert(parsed.data)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // NOVO: sincroniza status do estoque
  if (parsed.data.arvore_estoque_id) {
    const novoStatus = parsed.data.tipo === 'desmontagem' ? 'disponivel' : 'em_uso';
    await supabase
      .from('arvores_estoque')
      .update({ status: novoStatus })
      .eq('id', parsed.data.arvore_estoque_id);
  }

  return NextResponse.json(data, { status: 201 });
}