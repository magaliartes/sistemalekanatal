// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
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
      // Simular login (depois conecta com Supabase)
      console.log('Login com:', email);
      router.push('/dashboard');
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
          {/* Header com tema natalino */}
          <div className="text-center mb-8 pb-6 border-b-2 border-green-200">
            
            <h1 className="text-3xl font-bold text-slate-900">
              Leka Natal
            </h1>

            <p className="text-slate-500 mt-2">
              Painel Administrativo
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                📧 E-mail
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
                🔐 Senha
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
                  <span>🚀</span> Entrar no Sistema
                </span>
              )}
            </button>
          </form>

          {/* Credenciais de teste */}
          <div className="mt-6 pt-6 border-t-2 border-yellow-200 bg-green-50 rounded-lg p-4">
            <p className="text-center text-sm font-semibold text-green-900 mb-3">
              Acesso de Demonstração
            </p>
            <div className="space-y-2 text-sm text-green-800">
              <p><strong>Email:</strong> admin@arvoresnatal.com</p>
              <p><strong>Senha:</strong> demo123456</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>@2026 Leka Natal</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-white/80 backdrop-blur rounded-xl border-2 border-yellow-300 shadow-lg">
          <p className="flex items-center gap-2 text-green-700 font-semibold text-sm">
            <span>💡</span>
            Dica: Use as credenciais acima para acessar o sistema!
          </p>
        </div>
      </div>
    </div>
  );
}