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
      icon: '📅',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Confirmados',
      value: '0',
      icon: '✅',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Funcionários Ativos',
      value: '3',
      icon: '👥',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Custo Transporte',
      value: 'R$ 0',
      icon: '🚗',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const menuItems = [
    { label: 'Clientes', icon: '👥', href: '/clientes', color: 'from-blue-500 to-blue-600' },
    { label: 'Funcionários', icon: '👔', href: '/funcionarios', color: 'from-purple-500 to-purple-600' },
    { label: 'Agenda', icon: '📅', href: '/agenda', color: 'from-green-500 to-green-600' },
    { label: 'Serviços', icon: '🎄', href: '/servicos', color: 'from-red-500 to-red-600' },
    { label: 'Estoque', icon: '📦', href: '/estoque', color: 'from-yellow-500 to-yellow-600' },
    { label: 'Financeiro', icon: '💰', href: '/financeiro', color: 'from-green-600 to-emerald-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-700 text-white shadow-lg border-b-4 border-red-600 sticky top-0 z-40">
        <div className="container-main py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-bounce-soft">🎄</span>
              <div>
                <h1 className="text-3xl font-black">Dashboard Operacional</h1>
                <p className="text-green-100 text-sm">Bem-vindo ao sistema premium de árvores de natal</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary hover:scale-105 flex items-center gap-2"
            >
              <span>🚪</span> Sair
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="container-main py-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="card hover:scale-105 hover:shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold">{stat.label}</p>
                  <p className="text-4xl font-black text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`text-5xl p-4 rounded-xl ${stat.bgColor}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Menu de Navegação */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">📌</span> Módulos do Sistema
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, idx) => (
              <Link key={idx} href={item.href}>
                <div className="card hover:scale-105 cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`text-5xl p-4 rounded-xl bg-gradient-to-br ${item.color} text-white group-hover:rotate-12 transition-transform`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                        {item.label}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Clique para acessar →
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Status do Sistema */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sistema Status */}
          <div className="card border-2 border-green-300">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">✨</span>
              <h3 className="text-xl font-bold text-gray-900">Status do Sistema</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-green-800 font-semibold">✅ Servidor Operacional</p>
                <p className="text-sm text-green-700 mt-1">Funcionando perfeitamente</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-green-800 font-semibold">✅ Banco de Dados Ativo</p>
                <p className="text-sm text-green-700 mt-1">Conectado e sincronizado</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-800 font-semibold">🗺️ Google Maps Integrado</p>
                <p className="text-sm text-blue-700 mt-1">Rotas e distâncias disponíveis</p>
              </div>
            </div>
          </div>

          {/* Dicas e Informações */}
          <div className="card border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">💡</span>
              <h3 className="text-xl font-bold text-gray-900">Dicas Importantes</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <p className="flex items-start gap-2">
                <span className="text-lg mt-1">🎄</span>
                <span><strong>Árvores:</strong> Gerencie modelos e estoque na seção de Estoque</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-lg mt-1">👥</span>
                <span><strong>Equipes:</strong> Distribua funcionários de forma otimizada</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-lg mt-1">📅</span>
                <span><strong>Agenda:</strong> Organize os agendamentos do dia</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-lg mt-1">💰</span>
                <span><strong>Financeiro:</strong> Acompanhe custos e pagamentos</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center p-6 bg-white rounded-xl shadow-lg border-2 border-green-200">
          <p className="text-gray-700 font-semibold text-lg">
            🎉 Bem-vindo ao Sistema Premium de Gestão de Árvores de Natal
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Desenvolvido com tecnologia de ponta para oferecer a melhor experiência operacional
          </p>
          <div className="mt-4 flex justify-center gap-4 text-2xl">
            <span className="animate-bounce-soft">🎄</span>
            <span className="animate-swing">✨</span>
            <span className="animate-bounce-soft" style={{animationDelay: '0.5s'}}>🎁</span>
            <span className="animate-swing" style={{animationDelay: '0.5s'}}>❄️</span>
          </div>
        </div>
      </div>
    </div>
  );
}