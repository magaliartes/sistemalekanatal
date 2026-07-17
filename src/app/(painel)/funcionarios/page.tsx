import Link from 'next/link';
import { listarFuncionarios } from '@/lib/services/funcionarios';

export default async function FuncionariosPage() {
  const funcionarios = await listarFuncionarios();
  console.log('Quantidade:', funcionarios.length);

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white shadow-lg border-b-4 border-purple-400">
        <div className="container-main py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">👔</span>
              <div>
                <h1 className="text-3xl font-black">Gerenciar Funcionários</h1>
                <p className="text-purple-100">Controle sua equipe de trabalho</p>
              </div>
            </div>
            <Link href="/dashboard">
              <button className="btn btn-outline border-white text-white hover:bg-white/20">
                ← Voltar
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container-main py-10">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-black text-gray-900">Funcionários da Equipe</h2>
          <Link
            href="/funcionarios/novo"
            className="btn btn-primary"
          >
            <span>➕</span> Novo Funcionário
          </Link>
        </div>

        {/* Lista de Funcionários */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {funcionarios.map((funcionarios) => (
            <div key={funcionarios.id} className="card min-h-[220px] hover:scale-105 hover:shadow-2xl">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <div>
                    <h3 className="font-bold text-gray-900">{funcionarios.nome}</h3>
                    <br></br>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-400">
                    <span className="font-semibold">{funcionarios.telefone}</span>
                  </p>
                </div>
                <div style={{ height: '1opx' }} />
                <div className="flex gap-2">
                  <Link
                    href={`/funcionarios/${funcionarios.id}`}
                    className="w-full btn btn-primary text-sm text-center"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
          <br></br>
        {/* Info Box */}
        <div className="mt-12 p-6 bg-purple-50 rounded-xl border-2 border-purple-300">
          <p className="text-purple-900 font-semibold">
            💡 Total de {funcionarios.length} funcionários cadastrados
          </p>
        </div>
      </div>
    </div>
  );
}