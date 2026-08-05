'use client';

import { useState, useEffect } from 'react';
import { agendamentoSchema } from '@/lib/schemas/agendamentos';
import { HORA_POR_PERIODO, DURACAO_PADRAO_MINUTOS } from '@/lib/constants/agendamento';
import { gerarTituloAgendamento } from '@/lib/utils/agendamento';

type Agendamento = {
  id: string;
  cliente_id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  data_inicio: string;
  data_fim: string;
  status: string;
  observacoes?: string;
  modelo_arvore_id?: string;        
  quantidade_funcionarios?: number; 
  origem_arvore?: string;
  arvore_estoque_id?: string;
};

type Cliente = {
  id: string;
  nome: string;
  preferencia_periodo?: string;
  modelo_arvore_habitual_id?: string; 
};

type Props = {
  aberto: boolean;
  onClose: () => void;
  onSalvo: () => void;
  agendamento?: Agendamento | null;
  dataInicialSugerida?: string;
  clientes: Cliente[];
  modelosArvore: ModeloArvore[]; 
};

type ModeloArvore = {
  id: string;
  nome_modelo: string;
  tempo_montagem_1_funcionario: number | null;
  tempo_montagem_2_funcionarios: number | null;
  tempo_montagem_3_funcionarios: number | null;
};

type ArvoreEstoque = {
  id: string;
  numero_patrimonio: string;
};

const TIPOS = [
  { value: 'montagem', label: 'Montagem' },
  { value: 'desmontagem', label: 'Desmontagem' },
];

const STATUS = [
  { value: 'agendado', label: 'Agendado' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'concluido', label: 'Concluído' },
  { value: 'cancelado', label: 'Cancelado' },
];

function toDatetimeLocal(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AgendamentoModal({
  aberto,
  onClose,
  onSalvo,
  agendamento,
  dataInicialSugerida,
  clientes,
  modelosArvore, // NOVO — estava faltando
}: Props) {
  const isEdicao = !!agendamento;

  const [form, setForm] = useState({
    cliente_id: '',
    titulo: '',
    descricao: '',
    tipo: '',
    data_inicio: '',
    data_fim: '',
    status: '',
    observacoes: '',
    modelo_arvore_id: '',        // NOVO
    quantidade_funcionarios: 1,  // NOVO
    origem_arvore: '',    // NOVO — default aluguel
    arvore_estoque_id: '',       // NOVO
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [salvando, setSalvando] = useState(false);
  const [erroGeral, setErroGeral] = useState('');
  const [estoqueDisponivel, setEstoqueDisponivel] = useState<ArvoreEstoque[]>([]);

  useEffect(() => {
    if (!aberto) return;

    if (agendamento) {
      setForm({
        cliente_id: agendamento.cliente_id,
        titulo: agendamento.titulo,
        descricao: agendamento.descricao,
        tipo: agendamento.tipo,
        data_inicio: toDatetimeLocal(agendamento.data_inicio),
        data_fim: toDatetimeLocal(agendamento.data_fim),
        status: agendamento.status,
        observacoes: agendamento.observacoes ?? '',
        modelo_arvore_id: agendamento.modelo_arvore_id ?? '',           // NOVO
        quantidade_funcionarios: agendamento.quantidade_funcionarios ?? 1, // NOVO
        origem_arvore: agendamento.origem_arvore ?? '',
        arvore_estoque_id: agendamento.arvore_estoque_id ?? '',
      });
    } else {
      const inicio = dataInicialSugerida ? new Date(dataInicialSugerida) : new Date();
      const fim = new Date(inicio.getTime() + 60 * 60 * 1000);

      setForm({
        cliente_id: '',
        titulo: '',
        descricao:'',
        tipo: '',
        data_inicio: toDatetimeLocal(inicio.toISOString()),
        data_fim: toDatetimeLocal(fim.toISOString()),
        status: '',
        observacoes: '',
        modelo_arvore_id: '',        // NOVO
        quantidade_funcionarios: 1,  // NOVO
        origem_arvore: '',
        arvore_estoque_id: '',
      });
    }
    setErros({});
    setErroGeral('');
  }, [aberto, agendamento, dataInicialSugerida]);

  useEffect(() => {
    if (form.origem_arvore !== 'aluguel' || !form.modelo_arvore_id) {
      setEstoqueDisponivel([]);
      return;
    }

    fetch(`/api/estoque/arvores?modelo_id=${form.modelo_arvore_id}&status=disponivel`)
      .then((r) => r.json())
      .then(setEstoqueDisponivel);
  }, [form.modelo_arvore_id, form.origem_arvore]);

  useEffect(() => {
    if (form.origem_arvore !== 'propria') return;

    const cliente = clientes.find(c => c.id === form.cliente_id);

    if (!cliente?.modelo_arvore_habitual_id) return;

    setForm(prev => ({
      ...prev,
      modelo_arvore_id: cliente.modelo_arvore_habitual_id,
    }));
  }, [form.origem_arvore, form.cliente_id, clientes]);

  if (!aberto) return null;

  function handleChange(campo: string, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErros((prev) => ({ ...prev, [campo]: '' }));
  }

  function atualizarTitulo(
    tipo: string,
    clienteId: string,
    descricao: string
  ) {
    const cliente = clientes.find(c => c.id === clienteId);

    if (!cliente) return '';

    return gerarTituloAgendamento(
      tipo,
      cliente.nome,
      descricao
    );
  }

  function handleInicioChange(novoInicio: string) {
    setForm((prev) => {
      const duracaoAtual = prev.data_inicio && prev.data_fim
        ? diferencaEmMinutos(new Date(prev.data_inicio).toISOString(), new Date(prev.data_fim).toISOString())
        : DURACAO_PADRAO_MINUTOS;

      const novoFim = toDatetimeLocal(somarMinutos(new Date(novoInicio).toISOString(), duracaoAtual));
      return { ...prev, data_inicio: novoInicio, data_fim: novoFim };
    });
    setErros((prev) => ({ ...prev, data_inicio: '' }));
  }

  function handleClienteChange(clienteId: string) {
    setForm((prev) => {
      const novoForm = { ...prev, cliente_id: clienteId };
      if (isEdicao) return novoForm;

      novoForm.titulo = atualizarTitulo(
        novoForm.tipo,
        novoForm.cliente_id,
        novoForm.descricao
      );

      const cliente = clientes.find((c) => c.id === clienteId);
      if (!cliente) return novoForm;

      if (
        novoForm.origem_arvore === 'propria' &&
        cliente.modelo_arvore_habitual_id
      ) {
        novoForm.modelo_arvore_id = cliente.modelo_arvore_habitual_id;
      }

      if (!cliente.preferencia_periodo || HORA_POR_PERIODO[cliente.preferencia_periodo] === undefined) {
        return novoForm;
      }

      const dataBase = new Date(prev.data_inicio || new Date());
      dataBase.setHours(HORA_POR_PERIODO[cliente.preferencia_periodo], 0, 0, 0);
      const novoInicio = toDatetimeLocal(dataBase.toISOString());
      const duracao = tempoDoModelo(
        modelosArvore.find((m) => m.id === novoForm.modelo_arvore_id),
        prev.quantidade_funcionarios
      );

      novoForm.data_inicio = novoInicio;
      novoForm.data_fim = toDatetimeLocal(somarMinutos(new Date(novoInicio).toISOString(), duracao));
      return novoForm;
    });
    setErros((prev) => ({ ...prev, cliente_id: '' }));
  }

  function handleModeloOuFuncionariosChange(campo: 'modelo_arvore_id' | 'quantidade_funcionarios', valor: string) {
    setForm((prev) => {
      const novoForm = {
        ...prev,
        [campo]: campo === 'quantidade_funcionarios' ? Number(valor) : valor,
      };

      if (!prev.data_inicio) return novoForm;

      const modelo = modelosArvore.find(
        (m) => m.id === (campo === 'modelo_arvore_id' ? valor : prev.modelo_arvore_id)
      );
      const funcionarios = campo === 'quantidade_funcionarios' ? Number(valor) : prev.quantidade_funcionarios;
      const duracao = tempoDoModelo(modelo, funcionarios);

      novoForm.data_fim = toDatetimeLocal(
        somarMinutos(new Date(prev.data_inicio).toISOString(), duracao)
      );
      return novoForm;
    });
  }

  function somarMinutos(dataISO: string, minutos: number) {
    const d = new Date(dataISO);
    d.setMinutes(d.getMinutes() + minutos);
    return d.toISOString();
  }

  function diferencaEmMinutos(inicioISO: string, fimISO: string) {
    return (new Date(fimISO).getTime() - new Date(inicioISO).getTime()) / 60000;
  }

  function tempoDoModelo(modelo: ModeloArvore | undefined, funcionarios: number) {
    if (!modelo) return DURACAO_PADRAO_MINUTOS;
    const campo = {
      1: modelo.tempo_montagem_1_funcionario,
      2: modelo.tempo_montagem_2_funcionarios,
      3: modelo.tempo_montagem_3_funcionarios,
    }[funcionarios];
    return campo ?? DURACAO_PADRAO_MINUTOS;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErroGeral('');

    const tituloFinal = atualizarTitulo(form.tipo, form.cliente_id, form.descricao);

    const payload = {
      ...form,
      titulo: tituloFinal,
      data_inicio: new Date(form.data_inicio).toISOString(),
      data_fim: new Date(form.data_fim).toISOString(),
      // NOVO: campos opcionais com "" viram undefined, pra não quebrar .uuid().optional()
      modelo_arvore_id: form.modelo_arvore_id || undefined,
      arvore_estoque_id: form.arvore_estoque_id || undefined,
      origem_arvore: form.origem_arvore || undefined,
    };

    const parsed = agendamentoSchema.safeParse(payload);
    if (!parsed.success) {
      const camposComErro: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        camposComErro[issue.path[0] as string] = issue.message;
      }
      setErros(camposComErro);
      return;
    }
    
    setSalvando(true);
    try {
      const url = isEdicao
        ? `/api/agendamentos/${agendamento!.id}`
        : '/api/agendamentos';
      const method = isEdicao ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const erro = await res.json();
        setErroGeral(erro.error ?? 'Erro ao salvar agendamento');
        setSalvando(false);
        return;
      }

      onSalvo();
      onClose();
    } catch {
      setErroGeral('Erro de conexão. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir() {
    if (!agendamento) return;
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;

    setSalvando(true);
    const res = await fetch(`/api/agendamentos/${agendamento.id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      onSalvo();
      onClose();
    } else {
      setErroGeral('Erro ao excluir agendamento');
      setSalvando(false);
    }
  }

  const clienteSelecionado = clientes.find(
    c => c.id === form.cliente_id
  );

  const tituloPreview = clienteSelecionado
    ? gerarTituloAgendamento(
        form.tipo,
        clienteSelecionado.nome,
        form.descricao
      )
  : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdicao ? 'Editar agendamento' : 'Novo agendamento'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {erroGeral && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {erroGeral}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente
            </label>
            <select
              value={form.cliente_id}
              onChange={(e) => handleClienteChange(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
            {erros.cliente_id && (
              <p className="text-xs text-red-600 mt-1">{erros.cliente_id}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título do agendamento
            </label>

            <div className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700">
              {tituloPreview || (
                <span className="text-gray-400">
                  Será gerado automaticamente...
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <input
              type="text"
              value={form.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            {erros.descricao && (
              <p className="text-xs text-red-600 mt-1">{erros.descricao}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={form.tipo}
                onChange={(e) => handleChange('tipo', e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Selecione...</option>
                {TIPOS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Selecione...</option>
                {STATUS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Origem da árvore
            </label>
            <select
              value={form.origem_arvore}
              onChange={(e) => handleChange('origem_arvore', e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="">Selecione...</option>
              <option value="propria">Própria do cliente</option>
              <option value="aluguel">Aluguel</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo de árvore
              </label>
              <select
                value={form.modelo_arvore_id}
                onChange={(e) => handleModeloOuFuncionariosChange('modelo_arvore_id', e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Selecione...</option>
                {modelosArvore.map((m) => (
                  <option key={m.id} value={m.id}>{m.nome_modelo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Funcionários
              </label>
              <select
                value={form.quantidade_funcionarios}
                onChange={(e) => handleModeloOuFuncionariosChange('quantidade_funcionarios', e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>
          </div>

          {form.origem_arvore === 'aluguel' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidade do estoque
              </label>
              <select
                value={form.arvore_estoque_id}
                onChange={(e) => handleChange('arvore_estoque_id', e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Selecione...</option>
                {estoqueDisponivel.map((a) => (
                  <option key={a.id} value={a.id}>{a.numero_patrimonio}</option>
                ))}
              </select>
              {estoqueDisponivel.length === 0 && form.modelo_arvore_id && (
                <p className="text-xs text-amber-600 mt-1">
                  Nenhuma unidade disponível desse modelo no estoque.
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Início</label>
              <input
                type="datetime-local"
                value={form.data_inicio}
                onChange={(e) => handleInicioChange(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fim</label>
              <input
                type="datetime-local"
                value={form.data_fim}
                onChange={(e) => handleChange('data_fim', e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
              {erros.data_fim && (
                <p className="text-xs text-red-600 mt-1">{erros.data_fim}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={form.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              rows={3}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="Detalhes adicionais (opcional)"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {isEdicao ? (
              <button
                type="button"
                onClick={handleExcluir}
                disabled={salvando}
                className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                Excluir
              </button>
            ) : (
              <span />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {salvando ? 'Salvando...' : isEdicao ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}