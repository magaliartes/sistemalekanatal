'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    {
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      label: 'Clientes',
      href: '/clientes',
    },
    {
      label: 'Agenda',
      href: '/agenda',
    },
    {
      label: 'Funcionários',
      href: '/funcionarios',
    },
    {
      label: 'Serviços',
      href: '/servicos',
    },
    {
      label: 'Estoque',
      href: '/estoque',
    },
    {
      label: 'Financeiro',
      href: '/financeiro',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">
            Leka Natal
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Gestão Operacional
          </p>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {menu.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 rounded-xl transition
                    ${
                      active
                        ? 'bg-green-700 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={() => router.push('/login')}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 transition"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Sistema Leka Natal
          </h2>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}