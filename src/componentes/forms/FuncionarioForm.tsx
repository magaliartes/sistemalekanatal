'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FuncionarioFormProps {
  funcionario?: any;
}

const initialFormState = {
  nome: '',
  telefone: '',
  endereco: '',
  numero: '',
  bairro: '',
  cidade: 'São Paulo',
  cep: '',
  pix: '',
  especialidade: '',
  observacoes: '',
};

export default function FuncionarioForm({ funcionario }: FuncionarioFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState(initialFormState);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [enderecoBloqueado, setEnderecoBloqueado] = useState(true);

  // Sincroniza o form quando `funcionario` chega (ex: depois de um fetch assíncrono na tela de editar)
  useEffect(() => {
    if (funcionario) {
      setFormData({
        nome: funcionario.nome ?? '',
        telefone: funcionario.telefone ?? '',
        endereco: funcionario.endereco ?? '',
        numero: funcionario.numero ?? '',
        bairro: funcionario.bairro ?? '',
        cidade: funcionario.cidade ?? 'São Paulo',
        cep: funcionario.cep ?? '',
        pix: funcionario.pix ?? '',
        especialidade: funcionario.especialidade ?? '',
        observacoes: funcionario.observacoes ?? '',
      });
      // Se já tem endereço preenchido, mantém bloqueado; se não tem, libera
      setEnderecoBloqueado(Boolean(funcionario.endereco));
    }
  }, [funcionario]);

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

  const formatarTelefone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);

    if (digits.length <= 2) return digits.length ? `(${digits}` : digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    };

    const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const valorFormatado = formatarTelefone(value);

    setFormData(prev => ({
        ...prev,
        [name]: valorFormatado,
    }));
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

    if (!formData.nome || !formData.telefone) {
      setError('Preencha os campos obrigatórios: Nome e Telefone');
      return;
    }

    setIsLoading(true);

    try {
      const url = funcionario
        ? `/api/funcionarios/${funcionario.id}`
        : '/api/funcionarios';
      const method = funcionario ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Erro ao salvar funcionário');
      }

      setSuccess(funcionario ? 'Funcionário atualizado com sucesso!' : 'Funcionário cadastrado com sucesso!');

      setTimeout(() => {
        router.push('/funcionarios');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar funcionário');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInativar = async () => {
    if (!funcionario) return;

    const confirmado = window.confirm(
      `Tem certeza que deseja inativar "${funcionario.nome}"? Ele deixará de aparecer na listagem.`
    );

    if (!confirmado) return;

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/funcionarios/${funcionario.id}`, {
        method: 'DELETE',
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Erro ao inativar funcionário');
      }

      router.push('/funcionarios');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Erro ao inativar funcionário');
      setIsLoading(false);
    }
  };

  const isEdicao = Boolean(funcionario);

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white shadow-lg border-b-4 border-purple-400">
        <div className="container-main py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{isEdicao ? '✏️' : '➕'}</span>
              <div>
                <h1 className="text-3xl font-black">{isEdicao ? 'Editar Funcionário' : 'Novo Funcionário'}</h1>
                <p className="text-purple-100">
                  {isEdicao ? 'Atualize as informações do funcionário' : 'Cadastre um novo membro da equipe'}
                </p>
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
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg text-red-700 font-medium flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg text-green-700 font-medium flex items-start gap-3">
              <span className="text-lg">✅</span>
              <span>{success}</span>
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
                    onChange={handleTelefoneChange}
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
                    CEP
                  </label>
                  <div className="relative max-w-xs">
                    <input
                      type="text"
                      name="cep"
                      value={formData.cep}
                      onChange={handleCepChange}
                      placeholder="03000-000"
                      maxLength={9}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
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
                    placeholder="Ex: Rua das Flores"
                    readOnly={enderecoBloqueado}
                    className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition ${
                      enderecoBloqueado
                        ? 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
                        : 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                    }`}
                  />
                </div>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      readOnly={enderecoBloqueado}
                      className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition ${
                        enderecoBloqueado
                          ? 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
                          : 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
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
                          : 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                      }`}
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
                  🗑️ Inativar
                </button>
              )}

              <button type="submit" disabled={isLoading} className="flex-1 btn btn-primary">
                {isLoading ? '⏳ Salvando...' : isEdicao ? '✅ Salvar Alterações' : '✅ Cadastrar Funcionário'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}