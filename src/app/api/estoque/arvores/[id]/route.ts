import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('arvores_estoque')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.code === 'PGRST116' ? 404 : 500 }
    );
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('arvores_estoque')
      .update({
        numero_patrimonio: body.numero_patrimonio,
        modelo_id: body.modelo_id,
        status: body.status,
        observacoes: body.observacoes,
      })
      .eq('id', id)
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabase
    .from('arvores_estoque')
    .update({ status: 'Descartada' })
    .eq('id', id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}