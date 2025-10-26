// src/hooks/useWebSocketSingleton.ts
import { useEffect, useState } from "react";
import { wsClient } from "../services/websocket";

let globalMessages: any[] = [];
let arraySubscribers: ((msgs: any[]) => void)[] = [];
let messageSubscribers: ((msg: any) => void)[] = [];

wsClient.connect();

wsClient.onMessage((data) => {
  globalMessages = [...globalMessages, data];
  arraySubscribers.forEach((fn) => fn(globalMessages));
  messageSubscribers.forEach((fn) => fn(data)); // ✅ emit each new message individually
});

export const useWebSocketSingleton = () => {
  const [messages, setMessages] = useState(globalMessages);

  useEffect(() => {
    const handler = (msgs: any[]) => setMessages([...msgs]);
    arraySubscribers.push(handler);
    return () => {
      arraySubscribers = arraySubscribers.filter((h) => h !== handler);
    };
  }, []);

  const onMessage = (callback: (msg: any) => void) => {
    messageSubscribers.push(callback);
    return () => {
      messageSubscribers = messageSubscribers.filter((cb) => cb !== callback);
    };
  };

  return { messages, onMessage };
};
