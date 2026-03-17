import type { QueueMessageState } from "../types/queue-message-state";
import type { Ticket, TicketPrefix } from "../types/ticket";
import { formatTicketId } from "../utils/format-ticket-id";

const DEFAULT_RECENTLY_SERVE_LIMIT = 8;

interface QueueStoreState {
  lastTicketsNumber: {
    A: number;
    P: number;
  };
  pending: {
    normal: Ticket[];
    preferential: Ticket[];
  };
  activeByDesk: Record<number, Ticket | undefined>;
  recentlyServed: Ticket[];
}

export class TicketQueueStore {
  private state: QueueStoreState = {
    activeByDesk: {},
    lastTicketsNumber: {
      A: 0,
      P: 0,
    },
    pending: {
      normal: [],
      preferential: [],
    },
    recentlyServed: [],
  };

  getState(): QueueMessageState {
    return {
      activeByDesk: this.state.activeByDesk,
      lastTicketNumbers: this.state.lastTicketsNumber,
      pendingTotal: {
        normal: this.state.pending.normal.length,
        preferential: this.state.pending.preferential.length,
        combined:
          this.state.pending.normal.length +
          this.state.pending.preferential.length,
      },
      recentlyServed: this.state.recentlyServed,
    };
  }

  reset() {
    this.state = {
      activeByDesk: {},
      lastTicketsNumber: {
        A: 0,
        P: 0,
      },
      pending: {
        normal: [],
        preferential: [],
      },
      recentlyServed: [],
    };
  }

  createTicket(prefix: TicketPrefix): Ticket {
    const validPrefix = ["A", "P"];
    if (!validPrefix.includes(prefix)) {
      throw new Error(
        `Invalid prefix: ${prefix}. Must be ${validPrefix.join(", ")}`,
      );
    }

    let currentNumber = this.state.lastTicketsNumber[prefix] ?? 0;
    if (currentNumber >= 999) {
      currentNumber = 0;
    }

    const nextNumber = currentNumber + 1;
    this.state.lastTicketsNumber[prefix] = nextNumber;

    const ticket: Ticket = {
      id: formatTicketId(prefix, nextNumber),
      prefix: prefix,
      number: nextNumber,
      createAt: Date.now(),
      servedAt: undefined,
      deskNumber: undefined,
    };

    if (prefix === "P") {
      this.state.pending.preferential.push(ticket);
    } else {
      this.state.pending.normal.push(ticket);
    }

    return ticket;
  }

  assignNextTicket(
    deskNumber: number,
    forceNormalTicket: boolean,
  ): Ticket | undefined {
    let ticket: Ticket | undefined = undefined;

    if (forceNormalTicket) {
      ticket = this.state.pending.normal.shift();
    }

    if (!ticket) {
      ticket = this.state.pending.preferential.shift();
    }

    if (!ticket) {
      ticket = this.state.pending.normal.shift();
    }

    if (!ticket) {
      return undefined;
    }

    ticket.deskNumber = deskNumber;
    ticket.servedAt = Date.now();

    this.state.activeByDesk[deskNumber] = ticket;
    this.pushRecentlyServed(ticket);

    return ticket;
  }

  private pushRecentlyServed(ticket: Ticket) {
    this.state.recentlyServed.unshift(ticket);

    if (this.state.recentlyServed.length > DEFAULT_RECENTLY_SERVE_LIMIT) {
      this.state.recentlyServed = this.state.recentlyServed.slice(0, DEFAULT_RECENTLY_SERVE_LIMIT);
    }
  }
}
