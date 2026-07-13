'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ClienteFormProps {
  cliente?: any;
}

const initialFormState = {
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
};

export default function ClienteForm({ cliente }: ClienteFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState(initialFormState);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [enderecoBloqueado, setEnderecoBloqueado] = useState(true);

  // Sincroniza o form quando `cliente` chega (ex: depois de um fetch assíncrono na tela de editar)
  useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.nome ?? '',
        telefone: cliente.telefone ?? '',
        whatsapp: cliente.whatsapp ?? '',
        endereco: cliente.endereco ?? '',
        numero: cliente.numero ?? '',
        complemento: cliente.complemento ?? '',
        bairro: cliente.bairro ?? '',
        cidade: cliente.cidade ?? 'São Paulo',
        cep: cliente.cep ?? '',
        observacoes: cliente.observacoes ?? '',
        preferencia_periodo: cliente.preferencia_periodo ?? '',
        horario_preferencial: cliente.horario_preferencial ?? '',
      });
    }
  }, [cliente]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatarCep = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 5) return digits;

    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  };

  const buscarCep = async (cepDigitado: string) => {
    const cepLimpo = cepDigitado.replace(/\D/g, '');

    if (cepLimpo.length === 0) {
      setEnderecoBloqueado(false);
      return;
    }

    if (cepLimpo.length !== 8) return;

    setBuscandoCep(true);
    setError('');

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError('CEP não encontrado. Preencha o endereço manualmente.');
        setEnderecoBloqueado(false);
        return;
      }

      setFormData(prev => ({
        ...prev,
        endereco: data.logradouro || prev.endereco,
        bairro: data.bairro || prev.bairro,
        cidade: data.localidade || prev.cidade,
      }));
      setEnderecoBloqueado(true);
    } catch (err) {
      setError('Erro ao buscar CEP. Preencha o endereço manualmente.');
      setEnderecoBloqueado(false);
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarCep(e.target.value);

    setFormData(prev => ({
      ...prev,
      cep: valorFormatado,
    }));

    buscarCep(valorFormatado);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.nome || !formData.whatsapp || !formData.endereco || !formData.bairro) {
      setError('Preencha os campos obrigatórios: Nome, WhatsApp, Endereço e Bairro');
      return;
    }

    setIsLoading(true);

    try {
      const url = cliente ? `/api/clientes/${cliente.id}` : '/api/clientes';
      const method = cliente ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Erro ao salvar cliente');
      }

      setSuccess(cliente ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!');

      setTimeout(() => {
        router.push('/clientes');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar cliente');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInativar = async () => {
    if (!cliente) return;

    const confirmado = window.confirm(
      `Tem certeza que deseja inativar o cliente "${cliente.nome}"? Ele deixará de aparecer na listagem, mas o histórico de agendamentos será mantido.`
    );

    if (!confirmado) return;

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/clientes/${cliente.id}`, {
        method: 'DELETE',
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Erro ao inativar cliente');
      }

      router.push('/clientes');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Erro ao inativar cliente');
      setIsLoading(false);
    }
  };

  const isEdicao = Boolean(cliente);

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg border-b-4 border-blue-400">
        <div className="container-main py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{isEdicao ? '✏️' : '➕'}</span>
              <div>
                <h1 className="text-3xl font-black">{isEdicao ? 'Editar Cliente' : 'Novo Cliente'}</h1>
                <p className="text-blue-100">
                  {isEdicao ? 'Atualize as informações do cliente' : 'Cadastre um novo cliente no sistema'}
                </p>
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
            <div className="mb-4 mt-2 p-4 bg-red-50 border-2 border-red-300 rounded-lg text-red-700 font-medium flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 mt-2 p-4 bg-green-50 border-2 border-green-300 rounded-lg text-green-700 font-medium flex items-start gap-3">
              <span className="text-lg">✅</span>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seção: Informações Pessoais */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-300 mt-2">
                👤 Informações Pessoais
              </h3>

              <div className="space-y-6"><br></br>
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
            </div><br></br>

            {/* Seção: Endereço */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-300">
                📍 Endereço
              </h3><br></br>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CEP *
                  </label>
                  <div className="relative max-w-xs">
                    <input
                      type="text"
                      name="cep"
                      value={formData.cep}
                      onChange={handleCepChange}
                      placeholder="01311-100"
                      maxLength={9}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                    {buscandoCep && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                        🔍
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Endereço
                  </label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Ex: Av. Paulista"
                    required
                    readOnly={enderecoBloqueado}
                    className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition ${
                      enderecoBloqueado
                        ? 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
                        : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      readOnly={enderecoBloqueado}
                      className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition ${
                        enderecoBloqueado
                          ? 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
                          : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      }`}
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
                      readOnly={enderecoBloqueado}
                      className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition ${
                        enderecoBloqueado
                          ? 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
                          : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Seção: Preferências */}
            <div><br></br><br></br>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-300">
                ⏰ Preferências
              </h3><br></br>

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
                    <option value="integral">Flexível</option>
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
            <div><br></br><br></br>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-300">
                📝 Observações
              </h3><br></br>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Observações Adicionais
                </label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  placeholder="Ex: Cliente VIP, acesso restrito..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div><br></br>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
              <Link href="/clientes" className="flex-1">
                <button type="button" className="w-full btn btn-outline text-gray-700">
                  ← Cancelar
                </button>
              </Link>

              {isEdicao && (
                <button
                  type="button"
                  onClick={handleInativar}
                  disabled={isLoading}
                  className="flex-1 btn btn-outline border-red-400 text-red-600 hover:bg-red-50"
                >
                  🗑️ Inativar Cliente
                </button>
              )}

              <button type="submit" disabled={isLoading} className="flex-1 btn btn-primary">
                {isLoading ? '⏳ Salvando...' : isEdicao ? '✅ Salvar Alterações' : '✅ Cadastrar Cliente'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}