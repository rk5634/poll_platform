// src/hooks/usePollUpdates.ts
import { useState, useEffect } from "react";
import { useWebSocketSingleton } from "./useWebSocketSingleton"; 
import { PollUpdateMessage, PollUpdatesState } from "../types/websocket";

export const usePollUpdates = (): PollUpdatesState => {
  const { messages } = useWebSocketSingleton(); // global live message feed

  const [updates, setUpdates] = useState<PollUpdatesState>({
    newPoll: null,
    latestVote: null,
    latestLike: null,
  });

  useEffect(() => {
    if (!messages.length) return;
    const latestMessage: PollUpdateMessage = messages[messages.length - 1];

    switch (latestMessage.type) {
      case "poll_created":
        setUpdates((prev) => ({ ...prev, newPoll: latestMessage.payload }));
        break;
      case "vote":
        setUpdates((prev) => ({ ...prev, latestVote: latestMessage.payload }));
        break;
      case "like":
        setUpdates((prev) => ({ ...prev, latestLike: latestMessage.payload }));
        break;
      default:
        console.log("Unhandled WS message type:", latestMessage.type);
    }
  }, [messages]);

  return updates;
};
