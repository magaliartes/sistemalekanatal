'use client';

import { useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import AgendamentoModal from '../componentes/AgendamentoModal';

type Agendamento = {
  id: string;
  cliente_id: string; // <-- precisa adicionar esse campo, o modal usa
  titulo: string;
  descricao: string,
  tipo: string;
  data_inicio: string;
  data_fim: string;
  status: string;
  observacoes?: string; // <-- e esse também
};

type ModeloArvore = {
  id: string;
  nome_modelo: string;
  tempo_montagem_1_funcionario: number | null;
  tempo_montagem_2_funcionarios: number | null;
  tempo_montagem_3_funcionarios: number | null;
};

type Cliente = {
  id: string;
  nome: string;
  preferencia_periodo?: string;
  modelo_arvore_habitual_id?: string;
};

const CORES_TIPO: Record<string, string> = {
  instalacao: '#16a34a',
  retirada: '#dc2626',
  manutencao: '#ca8a04',
  visita: '#2563eb',
};

export default function Agenda() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [eventos, setEventos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<Agendamento | null>(null);
  const [dataSugerida, setDataSugerida] = useState<string | undefined>();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [rangeAtual, setRangeAtual] = useState<{ start: string; end: string } | null>(null);
  const [modelosArvore, setModelosArvore] = useState<ModeloArvore[]>([]);

  const carregarAgendamentos = useCallback(async (start: string, end: string) => {
    setLoading(true);
    const res = await fetch(`/api/agendamentos?start=${start}&end=${end}`);
    const data = await res.json();
    setEventos(data);
    setLoading(false);
  }, []);

  // ↓↓↓ NOVO useEffect, carrega clientes uma vez ao montar ↓↓↓
  useEffect(() => {
    fetch('/api/clientes').then((r) => r.json()).then(setClientes);
  }, []);
  // ↑↑↑ fim do novo useEffect ↑↑↑

  useEffect(() => {
    fetch('/api/modelos-arvore').then((r) => r.json()).then(setModelosArvore);
  }, []);

  // ↓↓↓ NOVAS funções, entre o useEffect e o eventosFormatados ↓↓↓
  function abrirNovo(dataStr: string) {
    const data = new Date(dataStr);
    data.setHours(9, 0, 0, 0); // padrão: 9h da manhã

    setAgendamentoSelecionado(null);
    setDataSugerida(data.toISOString());
    setModalAberto(true);
  }

  function abrirEdicao(id: string) {
    const ag = eventos.find((e) => e.id === id) ?? null;
    setAgendamentoSelecionado(ag);
    setModalAberto(true);
  }
  // ↑↑↑ fim das novas funções ↑↑↑

  const eventosFormatados = eventos.map((ag) => ({
    id: ag.id,
    title: ag.titulo,
    start: ag.data_inicio,
    end: ag.data_fim,
    backgroundColor: CORES_TIPO[ag.tipo] ?? '#6b7280',
    borderColor: CORES_TIPO[ag.tipo] ?? '#6b7280',
    extendedProps: { status: ag.status, tipo: ag.tipo },
  }));

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {loading && (
        <div className="text-sm text-gray-400 mb-2">Carregando agendamentos...</div>
      )}
      <FullCalendar
        key={isMobile ? 'mobile' : 'desktop'}  // NOVO — força remontar ao trocar de mobile pra desktop
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={isMobile ? 'timeGridDay' : 'dayGridMonth'}
        locale={ptBrLocale}
        headerToolbar={
          isMobile
            ? {
                left: 'prev,next',
                center: 'title',
                right: 'timeGridDay,timeGridWeek', // NOVO: sem view de mês no mobile, menos apertado
              }
            : {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }
        }
        eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        slotMinTime="07:00:00"
        slotMaxTime="20:00:00"
        events={eventosFormatados}
        datesSet={(info) => {
          setRangeAtual({ start: info.startStr, end: info.endStr });
          carregarAgendamentos(info.startStr, info.endStr);
        }}
        editable={!isMobile}      // NOVO: desliga drag-and-drop no touch (evita toque acidental)
        selectable
        height="auto"
        aspectRatio={isMobile ? 0.8 : 1.35}  // NOVO: calendário mais "alto e estreito" no mobile
        eventClick={(info) => abrirEdicao(info.event.id)}
        dateClick={(info) => abrirNovo(info.date.toISOString())}
      />

      {/* ↓↓↓ NOVO: modal, fica fora do FullCalendar mas dentro da div principal ↓↓↓ */}
      <AgendamentoModal
        aberto={modalAberto}
        onClose={() => setModalAberto(false)}
        onSalvo={() => {
          if (rangeAtual) carregarAgendamentos(rangeAtual.start, rangeAtual.end);
        }}
        agendamento={agendamentoSelecionado}
        dataInicialSugerida={dataSugerida}
        clientes={clientes}
        modelosArvore={modelosArvore}
      />
    </div>
  );
}