import type { Ticket } from '../types/ticket';
import { formatTicketLabel } from '../utils/tickets';

type BigTicketProps = {
  ticket: Ticket | null;
};

export function BigTicket({ ticket }: BigTicketProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-sky-500/15 via-white/3 to-fuchsia-500/10 p-6 ring-1 ring-white/10">
      <div className="absolute -right-10 -top-10 size-56 rounded-full bg-sky-400/10 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 size-56 rounded-full bg-fuchsia-400/10 blur-2xl" />

      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-extrabold uppercase tracking-widest text-white/80">
              Ahora atendiendo
            </div>
            <div className="mt-2 text-5xl font-semibold tracking-tight sm:text-6xl">
              {ticket ? formatTicketLabel(ticket) : '—'}
            </div>
          </div>

          <div className="min-w-28 rounded-2xl bg-white/5 px-5 py-4 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
            <div className="text-xs font-semibold tracking-wide text-white/60">
              Escritorio
            </div>
            <div className="mt-1 text-4xl font-extrabold leading-none tracking-tight text-white tabular-nums sm:text-5xl">
              {ticket ? `#${ticket.deskNumber}` : '—'}
            </div>
          </div>
        </div>

        <div className="mt-5 text-sm text-white/65">
          Aquí normalmente mostrarías el sonido/animación del llamado.
        </div>
      </div>
    </div>
  );
}
