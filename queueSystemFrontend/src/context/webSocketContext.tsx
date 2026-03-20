import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ClientMessage, ServerMessage } from "../types/socket.types";

type ConnectionStatus =
  | "offline"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export type SocketMessageListener = (message: ServerMessage) => void;

interface WebSocketContextState {
  status: ConnectionStatus;
  socketId: string | null;
  // Methods
  connectToServer: () => void;
  disconnect: () => void;
  send: (message: ClientMessage) => void;
  subscribeToMessages: (listener: SocketMessageListener) => () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const WebSocketContext = createContext({} as WebSocketContextState);
const messageListenersRef = new Set<SocketMessageListener>();
let connecting = false;
let reconnectInterval: number = 100;

interface Props {
  children: ReactNode;
  url: string;
}

export const WebSocketProvider = ({ children, url }: Props) => {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [socketId, setSocketId] = useState<string | null>(null);

  const socket = useRef<WebSocket | null>(null);
  const shouldReconnectRef = useRef(true);

  useEffect(() => {
    console.log({ status });
  }, [status]);

  const disconnect = () => {
    socket.current?.close();
    socket.current = null;
    shouldReconnectRef.current = false;
    setStatus("offline");
  };

  const connect = useCallback(() => {
    if (connecting) return;
    connecting = true;

    setStatus("connecting");
    const ws = new WebSocket(url);
    shouldReconnectRef.current = true;

    ws.addEventListener("open", () => {
      connecting = false;
      socket.current = ws;
      setStatus("connected");
    });

    ws.addEventListener("close", () => {
      socket.current = null;
      setStatus("disconnected");
    });

    ws.addEventListener("error", (event) => {
      console.log({ customError: event });
    });

    ws.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "WELCOME") {
          setSocketId(message.payload.clientId);
        }

        messageListenersRef.forEach((listener) => listener(message));
      } catch (error) {
        console.error("Invalid socket message", error);
      }
    });

    return ws;
  }, [url]);

  const connectToServer = () => {
    connect();
  };

  const subscribeToMessages = (listener: SocketMessageListener) => {
    messageListenersRef.add(listener);

    return () => {
      messageListenersRef.delete(listener);
    };
  };

  useEffect(() => {
    if (!shouldReconnectRef.current) return;
    if (status === "connecting" || status === "connected") return;

    let interval: ReturnType<typeof setInterval>;
    if (status === "disconnected") {
      interval = setInterval(() => {
        console.log(`Reconnecting every ${reconnectInterval} seconds...`);
        connecting = false;
        reconnectInterval *= 2;
        connect();
        clearInterval(interval);
      }, reconnectInterval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status, connect]);

  const send = (message: ClientMessage) => {
    if (!socket.current) return;

    const jsonMessage = JSON.stringify(message);
    socket.current?.send(jsonMessage);
  };

  return (
    <WebSocketContext
      value={{
        status: status,
        send: send,
        connectToServer: connectToServer,
        disconnect: disconnect,
        socketId: socketId,
        subscribeToMessages: subscribeToMessages,
      }}
    >
      {children}
    </WebSocketContext>
  );
};
