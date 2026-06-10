// src/app/dashboard/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  const stats = [
    {
      label: 'Agendamentos Hoje',
      value: '0',
    },
    {
      label: 'Confirmados',
      value: '0',
    },
    {
      label: 'Funcionários Ativos',
      value: '3',
    },
    {
      label: 'Custo Transporte',
      value: 'R$ 0',
    },
  ];

  const menuItems = [
    { label: 'Clientes', href: '/clientes' },
    { label: 'Funcionários', href: '/funcionarios' },
    { label: 'Agenda', href: '/agenda' },
    { label: 'Serviços', href: '/servicos' },
    { label: 'Estoque', href: '/estoque' },
    { label: 'Financeiro', href: '/financeiro' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container-main py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Leka Natal
              </h1>
              <p className="text-sm text-slate-500">
                Painel Operacional
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium border border-slate-300 rounded-xl hover:bg-slate-100 transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container-main py-6">
        {/* Título */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Dashboard
          </h2>
          <p className="text-slate-500 mt-1">
            Resumo geral das operações
          </p>
        </div>

        {/* Indicadores */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
            >
              <p className="text-sm text-slate-500">
                {stat.label}
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Próximos Serviços */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Próximos Serviços
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between py-3 border-b border-slate-100">
              <span className="font-medium text-slate-700">
                Nenhum serviço agendado
              </span>

              <span className="text-slate-400">
                --
              </span>
            </div>
          </div>
        </div>

        {/* Módulos */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Módulos
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
              >
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-green-700 transition cursor-pointer h-full">
                  <h4 className="font-semibold text-slate-900">
                    {item.label}
                  </h4>

                  <p className="text-sm text-slate-500 mt-1">
                    Acessar módulo
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}