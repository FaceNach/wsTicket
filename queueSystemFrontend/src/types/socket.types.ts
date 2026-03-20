import type { QueueMessageState } from "./queue-message.types";
import type { Ticket } from "./ticket";

export type ClientMessage =
  | { type: "GET_STATE" }
  | { type: "CREATE_TICKET"; payload: { isPreferential: boolean } }
  | {
      type: "REQUEST_NEXT_TICKET";
      payload: { desknumber: number; forceNormalTicket: boolean };
    }
  | { type: "RESET_QUEUE" };

export type ServerMessage =
  | { type: "ERROR"; payload: { error: string } }
  | { type: "TICKET_CREATED"; payload: { ticket: Ticket } }
  | { type: "NEXT_TICKET_ASSIGNED"; payload: { ticket?: Ticket } }
  | { type: "QUEUE_EMPTY" }
  | { type: "QUEUE_STATE"; payload: { state: QueueMessageState } };
