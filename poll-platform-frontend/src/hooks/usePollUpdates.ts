import { useEffect, useReducer } from "react";
import { useWebSocketSingleton } from "./useWebSocketSingleton";
import { PollUpdateMessage, PollUpdatesState } from "../types/websocket";

function updatesReducer(state: PollUpdatesState, msg: PollUpdateMessage): PollUpdatesState {
  switch (msg.type) {
    case "poll_created":
      return { ...state, newPoll: msg.payload };
    case "vote":
      return { ...state, latestVote: msg.payload };
    case "like":
      return { ...state, latestLike: msg.payload };
    default:
      console.warn("Unhandled WS message type:", msg.type);
      return state;
  }
}

export const usePollUpdates = (): PollUpdatesState => {
  const { onMessage } = useWebSocketSingleton();

  const [updates, dispatch] = useReducer(updatesReducer, {
    newPoll: null,
    latestVote: null,
    latestLike: null,
  });

  useEffect(() => {
    const unsubscribe = onMessage((msg: PollUpdateMessage) => {
      dispatch(msg); // ✅ process each message directly
    });

    return unsubscribe;
  }, [onMessage]);

  return updates;
};
