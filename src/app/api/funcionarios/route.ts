import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('funcionarios')
      .insert([
        {
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
          ativo: true,
        }
      ])
      .select()

    if (error) {
      console.error(error)

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}