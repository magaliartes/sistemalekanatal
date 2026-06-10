// src/app/estoque/arvores/page.tsx
'use client';

import Link from 'next/link';

const arvores = [
  {
    id: 1,
    numero_patrimonio: 'ARV-001',
    modelo: 'Pequena (1.5m)',
    status: 'Disponível',
    statusColor: 'badge-success',
  },
  {
    id: 2,
    numero_patrimonio: 'ARV-002',
    modelo: 'Média (2.2m)',
    status: 'Disponível',
    statusColor: 'badge-success',
  },
  {
    id: 3,
    numero_patrimonio: 'ARV-003',
    modelo: 'Grande (3.0m)',
    status: 'Em Uso',
    statusColor: 'badge-warning',
  },
  {
    id: 4,
    numero_patrimonio: 'ARV-004',
    modelo: 'Gigante (4.0m)',
    status: 'Disponível',
    statusColor: 'badge-success',
  },
];

export default function ArvorresPage() {
  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-700 to-yellow-600 text-white shadow-lg border-b-4 border-yellow-400">
        <div className="container-main py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🎄</span>
              <div>
                <h1 className="text-3xl font-black">Estoque de Árvores</h1>
                <p className="text-yellow-100">Gerenciar árvores de Natal</p>
              </div>
            </div>
            <Link href="/estoque">
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
          <h2 className="text-2xl font-black text-gray-900">Árvores Cadastradas</h2>
          <Link href="/estoque/arvores/novo">
            <button className="btn btn-primary">
              <span>➕</span> Nova Árvore
            </button>
          </Link>
        </div>

        {/* Tabela de Árvores */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-yellow-50 border-b-2 border-yellow-300">
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Patrimônio</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Modelo</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {arvores.map((arvore, idx) => (
                  <tr key={arvore.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {arvore.numero_patrimonio}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {arvore.modelo}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${arvore.statusColor}`}>
                        {arvore.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link href={`/estoque/arvores/${arvore.id}`}>
                          <button className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">
                            Editar
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 p-6 bg-yellow-50 rounded-xl border-2 border-yellow-300">
          <p className="text-yellow-900 font-semibold">
            🎄 Total de {arvores.length} árvores cadastradas no sistema
          </p>
        </div>
      </div>
    </div>
  );
}
