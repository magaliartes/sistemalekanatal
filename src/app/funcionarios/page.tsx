// src/app/clientes/page.tsx
'use client';

import Link from 'next/link';

const clientes = [
  {
    id: 1,
    nome: 'Empresa ABC',
    bairro: 'Bela Vista',
    whatsapp: '5511999999001',
    status: 'Ativo',
  },
  {
    id: 2,
    nome: 'Residência Silva',
    bairro: 'Tatuapé',
    whatsapp: '5511999999002',
    status: 'Ativo',
  },
  {
    id: 3,
    nome: 'Consultório Dr. Santos',
    bairro: 'Vila Mariana',
    whatsapp: '5511999999003',
    status: 'Ativo',
  },
];

export default function ClientesPage() {
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
          <button className="btn btn-primary">
            <span>➕</span> Novo Cliente
          </button>
        </div>

        {/* Lista de Clientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientes.map((cliente) => (
            <div key={cliente.id} className="card hover:scale-105 hover:shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                    👤
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{cliente.nome}</h3>
                    <p className="text-sm text-gray-500">{cliente.bairro}</p>
                  </div>
                </div>
                <span className="badge badge-success">{cliente.status}</span>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm text-gray-600 mb-3">
                  📱 <span className="font-semibold">{cliente.whatsapp}</span>
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 btn btn-primary text-sm">Editar</button>
                  <button className="flex-1 btn btn-outline text-sm">Histórico</button>
                </div>
              </div>
            </div>
          ))}
        </div>

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

// ============================================================
// src/app/funcionarios/page.tsx
// ============================================================

export function FuncionariosPage() {
  const funcionarios = [
    {
      id: 1,
      nome: 'João Silva',
      especialidade: 'Montagem',
      telefone: '11999999001',
      status: 'Ativo',
    },
    {
      id: 2,
      nome: 'Maria Santos',
      especialidade: 'Desmontagem',
      telefone: '11999999002',
      status: 'Ativo',
    },
    {
      id: 3,
      nome: 'Carlos Oliveira',
      especialidade: 'Ambos',
      telefone: '11999999003',
      status: 'Ativo',
    },
  ];

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
          <button className="btn btn-primary">
            <span>➕</span> Novo Funcionário
          </button>
        </div>

        {/* Lista de Funcionários */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {funcionarios.map((func) => (
            <div key={func.id} className="card hover:scale-105 hover:shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                    👨‍💼
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{func.nome}</h3>
                    <p className="text-sm text-gray-500">{func.especialidade}</p>
                  </div>
                </div>
                <span className="badge badge-success">{func.status}</span>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm text-gray-600 mb-3">
                  📱 <span className="font-semibold">{func.telefone}</span>
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 btn btn-primary text-sm">Editar</button>
                  <button className="flex-1 btn btn-outline text-sm">Disponibilidade</button>
                </div>
              </div>
            </div>
          ))}
        </div>

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