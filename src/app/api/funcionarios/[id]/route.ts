import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('funcionarios')
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
      .from('funcionarios')
      .update({
        nome: body.nome,
        telefone: body.telefone,
        endereco: body.endereco || null,
        numero: body.numero || null,
        bairro: body.bairro || null,
        cidade: body.cidade || null,
        cep: body.cep || null,
        pix: body.pix || null,
        especialidade: body.especialidade || null,
        observacoes: body.observacoes || null,
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabase
    .from('funcionarios')
    .update({ ativo: false })
    .eq('id', id);

  if (error) {
    console.error(error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}