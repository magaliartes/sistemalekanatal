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
    { label: 'Painel', href: '/dashboard' },
    { label: 'Clientes', href: '/clientes' },
    { label: 'Funcionários', href: '/funcionarios' },
    { label: 'Agenda', href: '/agenda' },
    { label: 'Estoque', href: '/estoque/arvores' },
    { label: 'Financeiro', href: '/financeiro' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-green-700">
            Natal da Leka
          </h2>

          <p className="text-sm text-slate-500">
            Gestão Operacional
          </p>
        </div>

        <nav className="flex-1 p-4">
          {/* O container abaixo garante o alinhamento centralizado e o respiro vertical */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {menu.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition ${
                    active
                      ? 'bg-green-700' // Removemos o text-white daqui, vamos forçar no style
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '15px',
                    // Aqui está o segredo:
                    color: active ? '#ffffff' : '#334155', 
                    fontWeight: active ? '600' : '500'
                  }}
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
            className="w-full px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-100"
          >
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}