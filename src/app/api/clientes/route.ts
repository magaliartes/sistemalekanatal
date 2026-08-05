import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('ativo', true)
    .order('nome', { ascending: true });

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
      .from('clientes')
      .insert([
        {
          nome: body.nome,
          telefone: body.telefone,
          whatsapp: body.whatsapp,
          endereco: body.endereco,
          numero: body.numero,
          complemento: body.complemento,
          bairro: body.bairro,
          cidade: body.cidade,
          cep: body.cep,
          observacoes: body.observacoes,
          preferencia_periodo: body.preferencia_periodo,
          horario_preferencial: body.horario_preferencial,
          modelo_arvore_habitual_id: body.modelo_arvore_habitual_id,
          ativo: true,
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