import { useEffect, useReducer, useRef } from "react";
import { useWebSocketSingleton } from "./useWebSocketSingleton";
import { PollUpdateMessage, PollUpdatesState } from "../types/websocket";

// Reducer ensures all messages are applied in order
function updatesReducer(state: PollUpdatesState, msg: PollUpdateMessage): PollUpdatesState {
  switch (msg.type) {
    case "poll_created":
      return { ...state, newPoll: msg.payload };
    case "vote":
      return { ...state, latestVote: msg.payload };
    case "like":
      return { ...state, latestLike: msg.payload };
    default:
      console.log("Unhandled WS message type:", msg.type);
      return state;
  }
}

export const usePollUpdates = (): PollUpdatesState => {
  const { messages } = useWebSocketSingleton();
  const lastProcessed = useRef(0);

  const [updates, dispatch] = useReducer(updatesReducer, {
    newPoll: null,
    latestVote: null,
    latestLike: null,
  });

  useEffect(() => {
    const newMessages = messages.slice(lastProcessed.current);
    newMessages.forEach((msg: PollUpdateMessage) => {
      dispatch(msg); // ← dispatch each message sequentially
    });
    lastProcessed.current = messages.length;
  }, [messages]);

  return updates;
};
