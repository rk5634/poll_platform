// src/hooks/usePolls.ts
import { useState, useEffect } from "react";
import { fetchPolls } from "../services/api";
import { ListPollsResponse as PollOut } from "../types/interfaces";
import { useWebSocketSingleton } from "./useWebSocketSingleton";
import { PollUpdateMessage } from "../types/websocket";

interface UsePollsResult {
  polls: PollOut[];
  loading: boolean;
  error: string | null;
}

export const usePolls = (): UsePollsResult => {
  const [polls, setPolls] = useState<PollOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { onMessage } = useWebSocketSingleton(); // subscribe per-message

  // --- Initial polls load ---
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPolls();
        if (!mounted) return;
        // keep original ordering you want (you had reverse before)
        setPolls(data.reverse());
      } catch (err) {
        console.error("Failed to fetch polls:", err);
        if (mounted) setError("Could not load polls. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // --- Real-time per-message updates (most robust) ---
  useEffect(() => {
    if (!onMessage) return;

    const handler = (rawMsg: PollUpdateMessage) => {
      // debug: uncomment for trace
      // console.debug("WS msg processing in usePolls:", rawMsg);

      setPolls((prevPolls) => {
        // Work on a shallow copy of the array
        const updatedPolls = prevPolls.map(p => ({ ...p, options: p.options.map(o => ({ ...o })) }));

        switch (rawMsg.type) {
          case "poll_created": {
            const newPoll = rawMsg.payload;
            // avoid duplicates
            if (!updatedPolls.some(p => p.id === newPoll.id)) {
              // Construct PollOut shape if necessary
              const newPollOut: PollOut = {
                id: newPoll.id,
                question: newPoll.question,
                options: newPoll.options.map((o: any) => ({ ...o })), // adapt as needed
                likes_count: newPoll.likes_count ?? 0,
                created_by: newPoll.created_by,
              };
              return [newPollOut, ...updatedPolls];
            }
            return updatedPolls;
          }

          case "vote": {
            const { poll_id, option_id, votes_count } = rawMsg.payload;
            const pIdx = updatedPolls.findIndex(p => p.id === poll_id);
            if (pIdx === -1) return updatedPolls;

            const poll = updatedPolls[pIdx];
            const oIdx = poll.options.findIndex(o => o.id === option_id);
            if (oIdx === -1) return updatedPolls;

            // Always set authoritative votes_count (do not rely on increments)
            if (poll.options[oIdx].votes_count === votes_count) {
              // no change
              return updatedPolls;
            }

            poll.options[oIdx] = { ...poll.options[oIdx], votes_count };

            // If your backend sends authoritative counts only for the changed option,
            // that's fine. If backend sometimes sends counts that should reset other options,
            // you may need logic to reconcile (e.g., set other option counts or recompute total).
            return updatedPolls;
          }

          case "like": {
            const { poll_id, likes_count } = rawMsg.payload;
            const pIdx = updatedPolls.findIndex(p => p.id === poll_id);
            if (pIdx === -1) return updatedPolls;
            if (updatedPolls[pIdx].likes_count === likes_count) return updatedPolls;
            updatedPolls[pIdx] = { ...updatedPolls[pIdx], likes_count };
            return updatedPolls;
          }

          default:
            console.warn("Unhandled WS message type in usePolls:", rawMsg.type);
            return updatedPolls;
        }
      }); // end setPolls
    }; // end handler

    const unsubscribe = onMessage(handler);
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [onMessage]);

  return { polls, loading, error };
};
