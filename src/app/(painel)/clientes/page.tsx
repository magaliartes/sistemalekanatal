import Link from 'next/link';
import { listarClientes } from '@/lib/services/clientes';

export const dynamic = 'force-dynamic';

export default async function ClientesPage() {
  const clientes = await listarClientes();
  console.log('Quantidade:', clientes.length);

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg border-b-4 border-blue-400">
        <div className="container-main py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">👥</span>
              <div>
                <h1 className="text-3xl font-black">Gerenciar Clientes</h1>
                <p className="text-blue-100">Visualize e gerencie todos os seus clientes</p>
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
          <h2 className="text-2xl font-black text-gray-900">Clientes Cadastrados</h2>
        <Link href="/clientes/novo" className="btn btn-primary">
        <span>➕</span> Novo Cliente
        </Link>
        </div>

        {/* Lista de Clientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientes.map((cliente) => (
            <div key={cliente.id} className="card min-h-[220px] hover:scale-105 hover:shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div>
                    <h3 className="font-bold text-gray-900">{cliente.nome}</h3>
                    <p className="text-sm text-gray-500">{cliente.bairro}</p>
                    <br></br>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    📱 <span className="font-semibold">{cliente.whatsapp}</span>
                  </p>
                </div>
                <div style={{ height: '40px' }} />
                <div className="flex gap-2">
                  <Link
                    href={`/clientes/${cliente.id}`}
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
        <div className="mt-12 p-6 bg-blue-50 rounded-xl border-2 border-blue-300">
          <p className="text-blue-900 font-semibold">
            💡 Total de {clientes.length} clientes cadastrados no sistema
          </p>
        </div>
      </div>
    </div>
  );
}
