import { use } from "react";
import { WebSocketContext } from "../context/webSocketContext";

export const useSocketTicket = () => {
  const { send, subscribeToMessages } = use(WebSocketContext);

  const createTicket = (isPreferential: boolean) => {
    send({
      type: "CREATE_TICKET",
      payload: {
        isPreferential: isPreferential,
      },
    });
  };

  const getQueueState = () => {
    send({
      type: "GET_STATE",
    });
  };

  const requestNextTicket = (
    deskNumber: number,
    forceNormalTicket: boolean,
  ) => {
    send({
      type: "REQUEST_NEXT_TICKET",
      payload: {
        deskNumber: deskNumber,
        forceNormalTicket: forceNormalTicket,
      },
    });
  };

  return {
    createTicket,
    getQueueState,
    requestNextTicket,
    
    subscribeToMessages,
  };
};
