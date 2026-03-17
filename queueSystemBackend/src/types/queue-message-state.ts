import type { Ticket } from "./ticket";

export interface QueueMessageState {
  lastTicketNumbers: {
    A: number;
    P: number;
  };
  pendingTotal: {
    normal: number;
    preferential: number;
    combined: number;
  };
  activeByDesk: Record<number, Ticket | undefined>;
  recentlyServed: Ticket[]; //last 8.
}
