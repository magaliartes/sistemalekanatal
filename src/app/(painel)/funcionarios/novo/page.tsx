// src/app/funcionarios/novo/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NovoFuncionarioPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    endereco: '',
    bairro: '',
    cidade: 'São Paulo',
    cep: '',
    pix: '',
    especialidade: '',
    observacoes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.nome || !formData.telefone) {
      setError('Preencha os campos obrigatórios: Nome e Telefone');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/funcionarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar funcionário');
      }

      setSuccess('Funcionário criado com sucesso!');
      setTimeout(() => {
        router.push('/funcionarios');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar funcionário');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white shadow-lg border-b-4 border-purple-400">
        <div className="container-main py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">➕</span>
              <div>
                <h1 className="text-3xl font-black">Novo Funcionário</h1>
                <p className="text-purple-100">Cadastre um novo membro da equipe</p>
              </div>
            </div>
            <Link href="/funcionarios">
              <button className="btn btn-outline border-white text-white hover:bg-white/20">
                ← Voltar
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="container-main py-10">
        <div className="max-w-2xl mx-auto card">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg text-red-700 font-medium">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg text-green-700 font-medium">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seção: Informações Pessoais */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-purple-300">
                👤 Informações Pessoais
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Ex: João Silva"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Especialidade
                  </label>
                  <select
                    name="especialidade"
                    value={formData.especialidade}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                  >
                    <option value="">Selecione...</option>
                    <option value="Montagem">Montagem</option>
                    <option value="Desmontagem">Desmontagem</option>
                    <option value="Ambos">Ambos</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Seção: Endereço */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-purple-300">
                📍 Endereço
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Endereço
                  </label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Ex: Rua das Flores"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bairro
                    </label>
                    <input
                      type="text"
                      name="bairro"
                      value={formData.bairro}
                      onChange={handleChange}
                      placeholder="Ex: Tatuapé"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CEP
                    </label>
                    <input
                      type="text"
                      name="cep"
                      value={formData.cep}
                      onChange={handleChange}
                      placeholder="03000-000"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cidade
                    </label>
                    <input
                      type="text"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Seção: Dados de Pagamento */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-purple-300">
                💰 Dados de Pagamento
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chave PIX
                </label>
                <input
                  type="text"
                  name="pix"
                  value={formData.pix}
                  onChange={handleChange}
                  placeholder="CPF, e-mail, celular ou chave aleatória"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-1">Para transferências automáticas</p>
              </div>
            </div>

            {/* Seção: Observações */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-purple-300">
                📝 Observações
              </h3>

              <div>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  placeholder="Ex: Disponível fim de semana, exp em árvores grandes..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
              <Link href="/funcionarios" className="flex-1">
                <button
                  type="button"
                  className="w-full btn btn-outline text-gray-700"
                >
                  ← Cancelar
                </button>
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 btn btn-primary"
              >
                {isLoading ? '⏳ Salvando...' : '✅ Cadastrar Funcionário'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// src/app/funcionarios/[id]/page.tsx
// ============================================================

// Mesmo formulário anterior, mas com modo edição
// (código será similar ao formulário de editar cliente)