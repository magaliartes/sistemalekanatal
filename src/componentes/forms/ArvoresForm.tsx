'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { listarModelosArvore } from '@/lib/services/modelosArvores';

interface ArvoresFormProps {
  arvores?: any;
}

const initialFormState = {
    numero_patrimonio: '',
    modelo_id: '',
    altura: '',
    status: 'disponivel',
    observacoes: '',
};

function formatarAltura(altura: number | string | null | undefined) {
  if (altura === null || altura === undefined || altura === '') return '';

  const valor = typeof altura === 'string' ? parseFloat(altura) : altura;

  if (isNaN(valor)) return '';

  return valor.toFixed(2).replace('.', ',');
}

export default function ArvoresForm({ arvores }: ArvoresFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState(initialFormState);
  const [modelos, setModelos] = useState<any[]>([]);

  // Sincroniza o form quando `arvore` chega (ex: depois de um fetch assíncrono na tela de editar)
  useEffect(() => {
    if (arvores) {
      setFormData({
        numero_patrimonio: arvores.numero_patrimonio ?? '',
        modelo_id: arvores.modelo_id ?? '',
        altura: formatarAltura(arvores.modelos_arvore?.altura),
        status: arvores.status ?? '',
        observacoes: arvores.observacoes ?? '',
      });
    }
  }, [arvores]);

  useEffect(() => {
    async function carregarModelos() {
        try {
        const data = await listarModelosArvore();
        setModelos(data);
        } catch (error) {
            console.error('Erro ao carregar modelos:', error);
            setError(error.message || 'Erro ao carregar modelos.');
        }
    }

    carregarModelos();
    }, []);

    const handleModeloChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const modeloId = e.target.value;
        const modeloSelecionado = modelos.find((m) => m.id === modeloId);

        setFormData(prev => ({
        ...prev,
        modelo_id: modeloId,
        altura: formatarAltura(modeloSelecionado?.altura),
        }));
    };

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

    if (!formData.numero_patrimonio || !formData.modelo_id ) {
      setError('Preencha os campos obrigatórios: Patrimonio e Modelo');
      return;
    }

    setIsLoading(true);

    try {
      const url = arvores ? `/api/estoque/arvores/${arvores.id}` : '/api/estoque/arvores';
      const method = arvores ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Erro ao salvar árvore');
      }

      setSuccess(arvores ? 'Árvore atualizada com sucesso!' : 'Árvore cadastrada com sucesso!');

      setTimeout(() => {
        router.push('/estoque/arvores');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar árvore');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInativar = async () => {
    if (!arvores) return;

    const confirmado = window.confirm(
      `Tem certeza que deseja inativar a árvore "${arvores.numero_patrimonio}"? Ela deixará de aparecer na listagem, mas o histórico de agendamentos será mantido.`
    );

    if (!confirmado) return;

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/estoque/arvores/${arvores.id}`, {
        method: 'DELETE',
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Erro ao inativar árvore');
      }

      router.push('/estoque/arvores');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Erro ao inativar árvore');
      setIsLoading(false);
    }
  };

  const isEdicao = Boolean(arvores);

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg border-b-4 border-blue-400">
        <div className="container-main py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{isEdicao ? '✏️' : '➕'}</span>
              <div>
                <h1 className="text-3xl font-black">{isEdicao ? 'Editar Árvore' : 'Nova Árvore'}</h1>
                <p className="text-blue-100">
                  {isEdicao ? 'Atualize as informações da árvore' : 'Cadastre uma nova árvore no sistema'}
                </p>
              </div>
            </div>
            <Link href="/estoque/arvores">
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
                🎄 Informações da árvore
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Número de Patrimônio *
                  </label>
                  <input
                    type="text"
                    name="numero_patrimonio"
                    value={formData.numero_patrimonio}
                    onChange={handleChange}
                    placeholder="ARV-001"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Modelo *
                  </label>
                  <select
                    name="modelo_id"
                    value={formData.modelo_id}
                    onChange={handleModeloChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                    >
                    <option value="">Selecione um modelo...</option>

                    {modelos.map((modelo) => (
                        <option key={modelo.id} value={modelo.id}>
                        {modelo.nome_modelo}
                        </option>
                    ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Altura (m)
                    </label>
                    <input
                        type="text"
                        name="altura"
                        value={formData.altura}
                        disabled
                        readOnly
                        placeholder="Selecione um modelo"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                    />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
                  >
                    <option value="disponivel">Disponível</option>
                    <option value="em_uso">Em Uso</option>
                    <option value="manutencao">Manutenção</option>
                    <option value="descartada">Descartada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleChange}
                    placeholder="Ex: Bom estado, Muito usada..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            
            {/* Botões */}
            <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
              <Link href="/estoque/arvores" className="flex-1">
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
                  🗑️ Inativar Árvore
                </button>
              )}

              <button type="submit" disabled={isLoading} className="flex-1 btn btn-primary">
                {isLoading ? '⏳ Salvando...' : isEdicao ? '✅ Salvar Alterações' : '✅ Cadastrar Árvore'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}