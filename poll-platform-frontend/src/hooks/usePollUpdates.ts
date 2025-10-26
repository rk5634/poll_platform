import { useRef, useState, useEffect } from "react";
import { useWebSocketSingleton } from "./useWebSocketSingleton"; 
import { PollUpdateMessage, PollUpdatesState } from "../types/websocket";

export const usePollUpdates = (): PollUpdatesState => {
  const { messages } = useWebSocketSingleton();
  const [updates, setUpdates] = useState<PollUpdatesState>({
    newPoll: null,
    latestVote: null,
    latestLike: null,
  });

  const lastProcessed = useRef(0);

  useEffect(() => {
    // process only new messages
    const newMessages = messages.slice(lastProcessed.current);
    newMessages.forEach((msg: PollUpdateMessage) => {
      switch (msg.type) {
        case "poll_created":
          setUpdates((prev) => ({ ...prev, newPoll: msg.payload }));
          break;
        case "vote":
          setUpdates((prev) => ({ ...prev, latestVote: msg.payload }));
          break;
        case "like":
          setUpdates((prev) => ({ ...prev, latestLike: msg.payload }));
          break;
        default:
          console.log("Unhandled WS message type:", msg.type);
      }
    });
    lastProcessed.current = messages.length;
  }, [messages]);

  return updates;
};