// src/app/clientes/novo/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NovoClientePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    whatsapp: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: 'São Paulo',
    cep: '',
    observacoes: '',
    preferencia_periodo: '',
    horario_preferencial: '',
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

    // Validações
    if (!formData.nome || !formData.whatsapp || !formData.endereco || !formData.bairro) {
      setError('Preencha os campos obrigatórios: Nome, WhatsApp, Endereço e Bairro');
      return;
    }

    setIsLoading(true);

    try {
      // Chamada API (quando implementar)
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar cliente');
      }

      setSuccess('Cliente criado com sucesso!');
      setTimeout(() => {
        router.push('/clientes');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar cliente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg border-b-4 border-blue-400">
        <div className="container-main py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">➕</span>
              <div>
                <h1 className="text-3xl font-black">Novo Cliente</h1>
                <p className="text-blue-100">Cadastre um novo cliente no sistema</p>
              </div>
            </div>
            <Link href="/clientes">
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
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-300">
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(11) 3000-0000"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="(11) 99999-9999"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Seção: Endereço */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-300">
                📍 Endereço
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Endereço *
                  </label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Ex: Av. Paulista"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Número
                    </label>
                    <input
                      type="text"
                      name="numero"
                      value={formData.numero}
                      onChange={handleChange}
                      placeholder="1000"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Complemento
                    </label>
                    <input
                      type="text"
                      name="complemento"
                      value={formData.complemento}
                      onChange={handleChange}
                      placeholder="Apto, sala, etc"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                      placeholder="01311-100"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      name="bairro"
                      value={formData.bairro}
                      onChange={handleChange}
                      placeholder="Ex: Bela Vista"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Seção: Preferências */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-300">
                ⏰ Preferências
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Período Preferido
                  </label>
                  <select
                    name="preferencia_periodo"
                    value={formData.preferencia_periodo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="">Selecione...</option>
                    <option value="manha">Manhã (08:00 - 12:00)</option>
                    <option value="tarde">Tarde (13:00 - 17:00)</option>
                    <option value="noite">Noite (17:00 - 21:00)</option>
                    <option value="integral">Integral (flexível)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Horário Específico
                  </label>
                  <input
                    type="time"
                    name="horario_preferencial"
                    value={formData.horario_preferencial}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Seção: Observações */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-300">
                📝 Observações
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Observações Adicionais
                </label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  placeholder="Ex: Cliente VIP, tem pets, acesso restrito..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
              <Link href="/clientes" className="flex-1">
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
                {isLoading ? '⏳ Salvando...' : '✅ Cadastrar Cliente'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}