// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login({ email, password });

      if (!result.success) {
        setError(result.error || 'E-mail ou senha inválidos');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-christmas relative overflow-hidden flex items-center justify-center p-4">
      
      {/* Card de Login */}
      <div className="w-full max-w-md relative z-10">
        <div className="card shadow-2xl border border-slate-200 backdrop-blur-sm bg-white/95">

          <div 
            className="text-center pb-6 border-b-2 border-green-200" 
            style={{ marginBottom: '30px' }} // Ajuste esse valor como quiser
          >
            <h1 className="text-3xl font-bold text-slate-900">
              Natal da Leka
            </h1><br></br>
            <p className="text-slate-500 mt-2">
              Painel Administrativo
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                E-mail 
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl h-12 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Senha 
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl h-12 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>

            {/* Erro */}
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg text-red-700 font-medium text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary text-lg font-bold py-3 mt-6 hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Entrando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Entrar no Sistema
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500" style={{ marginTop: '30px' }}>
            <p>@2026 Natal da Leka</p>
          </div>
        </div>

      </div>
    </div>
  );
}