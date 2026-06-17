import { supabase } from './supabase'

export async function listarFuncionarios() {
  const { data, error } = await supabase
    .from('funcionarios')
    .select('*')

  if (error) throw error

  return data
}

import Link from 'next/link'

<Link
  href="/funcionarios/novo"
  className="bg-green-600 text-white px-4 py-2 rounded"
>
  Novo Funcionário
</Link>