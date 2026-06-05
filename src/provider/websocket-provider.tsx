import { useEffect, useState } from "react";
import { WebSocketContext } from "@/contexts/websocket-context";

export function WebSocketProvider({
  children,
  sppg_id,
}: {
  children: React.ReactNode;
  sppg_id: number;
}) {
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://192.168.1.10:4040/ws/${sppg_id}`);

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
