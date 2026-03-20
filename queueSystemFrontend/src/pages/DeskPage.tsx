import { useNavigate } from 'react-router-dom';
import { BigTicket } from '../components/BigTicket';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { Panel } from '../components/Panel';
import { TicketCard } from '../components/TicketCard';
import type { Ticket } from '../types/ticket';

const previewDeskNumber = 1;

const previewCurrentServing: Ticket = {
  id: 'preview-current-serving',
  prefix: 'A',
  number: 24,
  deskNumber: previewDeskNumber,
  createdAt: new Date(),
  servedAt: null,
};

const previewLastServedForDesk: Ticket[] = [
  {
    id: 'preview-served-1',
    prefix: 'A',
    number: 23,
    deskNumber: previewDeskNumber,
    createdAt: new Date(),
    servedAt: new Date(),
  },
  {
    id: 'preview-served-2',
    prefix: 'A',
    number: 22,
    deskNumber: previewDeskNumber,
    createdAt: new Date(),
    servedAt: new Date(),
  },
  {
    id: 'preview-served-3',
    prefix: 'A',
    number: 21,
    deskNumber: previewDeskNumber,
    createdAt: new Date(),
    servedAt: new Date(),
  },
];

export function DeskPage() {
  const navigate = useNavigate();
  const deskNumber = previewDeskNumber;
  const currentServing = previewCurrentServing;
  const lastServedForDesk = previewLastServedForDesk.slice(0, 8);

  const isServing = Boolean(currentServing);
  const queueCount = 12;
  const hasQueue = queueCount > 0;

  function handleChangeDesk() {
    navigate('/desk/select');
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Escritorio de atención"
        description="Pantalla del operador: toma el siguiente ticket, atiende y finaliza."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Panel
            title="Control"
            description="Componentes típicos del operador."
            footer={
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button type="button" className="w-full sm:w-auto" disabled>
                  Tomar siguiente ticket
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  disabled
                >
                  Finalizar atención
                </Button>
              </div>
            }
          >
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/3 p-4 ring-1 ring-white/10">
              <div>
                <div className="text-xs font-semibold tracking-wide text-white/60">
                  Escritorio
                </div>
                <div className="mt-1 text-lg font-semibold tracking-tight text-white">
                  #{deskNumber}
                </div>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={handleChangeDesk}
              >
                Cambiar
              </Button>
            </div>

            <div className="mt-5 rounded-2xl bg-white/3 p-4 ring-1 ring-white/10">
              <div className="text-xs font-semibold text-white/60">Estado</div>
              <div className="mt-1 text-sm text-white/75">
                {isServing
                  ? 'Atendiendo ahora.'
                  : hasQueue
                  ? 'Listo para tomar el siguiente ticket.'
                  : 'No hay tickets en la cola.'}
              </div>
              <div className="mt-3 text-xs text-white/60">
                En cola:{' '}
                <span className="font-semibold text-white/80">
                  {queueCount}
                </span>
              </div>
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <BigTicket ticket={currentServing ?? null} />

          <Panel
            title="Últimos atendidos en este escritorio"
            description="Máximo 8 para lectura rápida."
          >
            {lastServedForDesk.length === 0 ? (
              <div className="rounded-2xl bg-white/3 p-4 text-sm text-white/65 ring-1 ring-white/10">
                No hay tickets recientes para este escritorio.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {lastServedForDesk.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
