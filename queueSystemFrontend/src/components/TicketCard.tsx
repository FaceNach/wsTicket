import type { Ticket } from '../types/ticket';
import { getDeskBadgeClassName } from '../utils/badge-class';
import { formatTicketLabel } from '../utils/tickets';

type TicketCardProps = {
  ticket: Ticket;
};

export function TicketCard({ ticket }: TicketCardProps) {
  const deskBadgeClassName = getDeskBadgeClassName(ticket.deskNumber ?? 0);

  return (
    <div className="rounded-2xl bg-white/3 p-4 ring-1 ring-white/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-medium text-white/60">Ticket</div>
          <div className="mt-1 text-lg font-semibold tracking-tight">
            {formatTicketLabel(ticket)}
          </div>
        </div>
        <div
          className={[
            'rounded-full px-3 py-1 text-xs font-semibold ring-1',
            deskBadgeClassName,
          ].join(' ')}
        >
          Escritorio {ticket.deskNumber}
        </div>
      </div>
    </div>
  );
}
