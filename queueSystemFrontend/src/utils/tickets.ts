import type { Ticket } from '../types/ticket';

export function formatTicketLabel(ticket: Ticket): string {
  return `${ticket.prefix}-${String(ticket.number).padStart(3, '0')}`;
}
