import type { Server } from "bun";
import {
  messageSchema,
  type MessageParsed,
} from "../schemas/websocket-message.schema";
import { ticketQueueService } from "../services/ticket-service.service";
import type { ClientMessage, HandleResult, ServerMessage } from "../types";
import type { Ticket, TicketPrefix } from "../types/ticket";

export const createErrorMessage = (error: string): ServerMessage => {
  return {
    type: "ERROR",
    payload: { error: error },
  };
};

export const createEmptyResponse = (): HandleResult => {
  return {
    broadcast: [],
    personal: [],
  };
};

export const createQueueStateMessage = (): ServerMessage => {
  return {
    type: "QUEUE_STATE",
    payload: {
      state: ticketQueueService.getState(),
    },
  };
};

export const createNewTicketMessage = (
  isPreferential: boolean,
): ServerMessage => {
  const prefix: TicketPrefix = isPreferential ? "P" : "A";
  const ticket = ticketQueueService.createTicket(prefix);

  return {
    type: "TICKET_CREATED",
    payload: { ticket: ticket },
  };
};

export const createResetQueueMessage = (): ServerMessage => {
  ticketQueueService.reset();

  return {
    type: "QUEUE_STATE",
    payload: { state: ticketQueueService.getState() },
  };
};

export const createNextTicketAssignedMessage = (
  deskNumber: number,
  forceNormalTicket: boolean,
): ServerMessage => {
  const ticket = ticketQueueService.assignNextTicket(
    deskNumber,
    forceNormalTicket,
  );

  if (!ticket) {
    return {
      type: "QUEUE_EMPTY",
    };
  }

  return {
    type: "NEXT_TICKET_ASSIGNED",
    payload: { ticket: ticket },
  };
};

export const handleMessage = (message: string): HandleResult => {
  try {
    const jsonData = JSON.parse(message);
    const parsedResult = messageSchema.safeParse(jsonData);

    const response = createEmptyResponse();

    if (!parsedResult.success) {
      console.log(parsedResult.error);
      const errorMessage = parsedResult.error.issues
        .map((issue) => issue.message)
        .join(", ");

      response.personal.push(
        createErrorMessage(`Validation error ${errorMessage}`),
      );

      return response;
    }

    const { type } = parsedResult.data;

    switch (type) {
      case "CREATE_TICKET":
        const ticket = createNewTicketMessage(
          parsedResult.data.payload.isPreferential,
        );

        response.personal.push(ticket);
        response.personal.push(createQueueStateMessage());
        response.broadcast.push(createQueueStateMessage());

        return response;

      case "GET_STATE":
        const stateMessage = createQueueStateMessage();
        response.personal.push(stateMessage);

        return response;

      case "REQUEST_NEXT_TICKET":
        const nextTicketMessage = createNextTicketAssignedMessage(
          parsedResult.data.payload.deskNumber,
          parsedResult.data.payload.forceNormalTicket,
        );

        response.personal.push(nextTicketMessage);
        response.personal.push(createQueueStateMessage());
        response.broadcast.push(createQueueStateMessage());

        return response;

      case "RESET_QUEUE":
        const resetMessage = createResetQueueMessage();
        response.personal.push(resetMessage);
        response.broadcast.push(resetMessage);

        return response;

      default:
        return {
          personal: [createErrorMessage(`Unknown message type: ${type}`)],
          broadcast: [],
        };
    }
  } catch (error) {
    return {
      personal: [createErrorMessage(`Unknown error ${error}`)],
      broadcast: [],
    };
  }
};
