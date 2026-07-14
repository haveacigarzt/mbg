import { useEffect, useState } from 'react';
import { WebSocketContext } from '@/contexts/websocket-context';

export function WebSocketProvider({ children, room_id }: { children: React.ReactNode; room_id: string }) {
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    if (!room_id) return;

    const ws = new WebSocket(`ws://192.168.1.11:4040/ws/${room_id}`);

    ws.onopen = () => {
      console.log('WS connected');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        setLastMessage({
          ...message,
          _receivedAt: Date.now()
        });
      } catch (error) {
        console.error('WS parse error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WS error:', error);
    };

    ws.onclose = () => {
      console.log('WS disconnected');
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [room_id]);

  return (
    <WebSocketContext.Provider
      value={{
        connected,
        lastMessage
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}
