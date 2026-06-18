import { createContext, useContext } from "react";

type WebSocketContextType = {
  connected: boolean;
  lastMessage: any;
};

export const WebSocketContext = createContext<WebSocketContextType | null>(
  null,
);

export function useWebSocket() {
  const ctx = useContext(WebSocketContext);

  if (!ctx) {
    throw new Error("useWebSocket must be used inside WebSocketProvider");
  }

  return ctx;
}
