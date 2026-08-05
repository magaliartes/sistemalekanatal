import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { agendamentoBaseSchema } from '@/lib/schemas/agendamentos';

type Params = { params: { id: string } };

export async function GET(request: NextRequest, { params }: Params) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('agendamentos')
    .select('*, clientes(nome, telefone)')
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const supabase = createClient();
  const body = await request.json();

  const parsed = agendamentoBaseSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.data_inicio && parsed.data.data_fim) {
    if (new Date(parsed.data.data_fim) <= new Date(parsed.data.data_inicio)) {
      return NextResponse.json(
        { error: { data_fim: 'Data de fim deve ser depois da data de início' } },
        { status: 400 }
      );
    }
  }

  const { data, error } = await supabase
    .from('agendamentos')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
  }

  // NOVO: sincroniza status do estoque
  if (parsed.data.arvore_estoque_id) {
    const novoStatus = parsed.data.tipo === 'desmontagem' ? 'disponivel' : 'em_uso';
    await supabase
      .from('arvores_estoque')
      .update({ status: novoStatus })
      .eq('id', parsed.data.arvore_estoque_id);
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const supabase = createClient();

  const { error } = await supabase
    .from('agendamentos')
    .delete()
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}