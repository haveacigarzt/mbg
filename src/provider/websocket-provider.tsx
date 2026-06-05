import { useEffect, useState } from "react";
import { WebSocketContext } from "@/contexts/websocket-context";

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4040/ws");

    ws.onopen = () => setConnected(true);

    ws.onclose = () => setConnected(false);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      setLastMessage(message);
    };

    return () => ws.close();
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        connected,
        lastMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}
