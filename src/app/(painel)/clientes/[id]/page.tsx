// src/app/clientes/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditarClientePage() {
  const router = useRouter();
  const params = useParams();
  const clienteId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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

  // Carregar dados do cliente
  useEffect(() => {
    const loadCliente = async () => {
      try {
        setIsLoading(true);
        // Simular carregamento (depois será API real)
        // Dados de exemplo
        setFormData({
          nome: 'Empresa ABC',
          telefone: '1132000001',
          whatsapp: '5511999999001',
          endereco: 'Av. Paulista',
          numero: '1000',
          complemento: '',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
          cep: '01311-100',
          observacoes: 'Cliente VIP',
          preferencia_periodo: 'manha',
          horario_preferencial: '10:00',
        });
      } catch (err: any) {
        setError('Erro ao carregar cliente');
      } finally {
        setIsLoading(false);
      }
    };

    loadCliente();
  }, [clienteId]);

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

    if (!formData.nome || !formData.whatsapp || !formData.endereco || !formData.bairro) {
      setError('Preencha os campos obrigatórios');
      return;
    }

    setIsSaving(true);

    try {
      // API call (quando implementar)
      const response = await fetch(`/api/clientes/${clienteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar cliente');
      }

      setSuccess('Cliente atualizado com sucesso!');
      setTimeout(() => {
        router.push('/clientes');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar cliente');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar este cliente?')) {
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(`/api/clientes/${clienteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar cliente');
      }

      setSuccess('Cliente deletado com sucesso!');
      setTimeout(() => {
        router.push('/clientes');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar cliente');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-light flex items-center justify-center">
        <div className="card text-center">
          <p className="text-xl font-bold text-gray-900 mb-4">⏳ Carregando...</p>
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg border-b-4 border-blue-400">
        <div className="container-main py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">✏️</span>
              <div>
                <h1 className="text-3xl font-black">Editar Cliente</h1>
                <p className="text-blue-100">Atualize as informações do cliente</p>
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
            {/* Informações Pessoais */}
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
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Endereço */}
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

            {/* Preferências */}
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

            {/* Observações */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-300">
                📝 Observações
              </h3>

              <div>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
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
                type="button"
                onClick={handleDelete}
                disabled={isSaving}
                className="btn btn-secondary"
              >
                🗑️ Deletar
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 btn btn-primary"
              >
                {isSaving ? '⏳ Salvando...' : '✅ Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}