// src/hooks/useWebSocketSingleton.ts
import { useState, useEffect } from "react";
import { wsClient } from "../services/websocket";

let globalMessages: any[] = [];   // store all messages globally
let subscribers: ((msgs: any[]) => void)[] = [];

wsClient.connect(); // ensure singleton socket is connected

wsClient.onMessage((data) => {
  globalMessages = [...globalMessages, data]; // ← new reference
  subscribers.forEach((fn) => fn(globalMessages));
});

export const useWebSocketSingleton = () => {
  const [messages, setMessages] = useState(globalMessages);

  useEffect(() => {
    const handler = (msgs: any[]) => setMessages([...msgs]);
    subscribers.push(handler);

    return () => {
      subscribers = subscribers.filter((h) => h !== handler);
    };
  }, []);

  return { messages };
};
