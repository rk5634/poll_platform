// src/hooks/useWebSocket.ts

import { useEffect, useState } from "react";
import { wsClient } from "../services/websocket";

/**
 * Basic React hook to connect to the singleton WSClient and collect
 * all incoming messages into a component's state array.
 * @returns An object containing the accumulated messages and the client instance.
 */
export const useWebSocket = () => {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // 1. Ensure connection is active
    wsClient.connect();

    // 2. Define the handler function
    const handler = (data: any) => {
      // Use functional state update to append the new message
      setMessages((prev) => [...prev, data]);
    };

    // 3. Register the handler
    wsClient.onMessage(handler);

    // 4. Cleanup: Remove the handler when the component unmounts
    return () => {
      wsClient.removeHandler(handler);
    };
  }, []); // Run only once on mount

  return { messages, client: wsClient };
};
