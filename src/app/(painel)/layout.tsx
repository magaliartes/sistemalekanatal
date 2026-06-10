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
    { label: 'Dashboard', href: '/dashboard' },
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
          <h1 className="text-xl font-bold text-green-700">
            Leka Natal
          </h1>

          <p className="text-sm text-slate-500">
            Gestão Operacional
          </p>
        </div>

        <nav className="flex-1 p-4">
          {menu.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-xl mb-2 transition ${
                  active
                    ? 'bg-green-700 text-white'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
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