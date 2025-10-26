import { useState, useEffect } from "react";
import { fetchPolls } from "../services/api";
import { ListPollsResponse as PollOut } from "../types/interfaces";
import { usePollUpdates } from "./usePollUpdates";
import { PollCreatedPayload, VotePayload, LikePayload } from "../types/websocket";

interface UsePollsResult {
  polls: PollOut[];
  loading: boolean;
  error: string | null;
}

export const usePolls = (): UsePollsResult => {
  const [polls, setPolls] = useState<PollOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Live WebSocket updates ---
  const { newPoll, latestVote, latestLike } = usePollUpdates();

  // --- Initial polls load ---
  useEffect(() => {
    const loadPolls = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPolls();
        setPolls(data.reverse());
      } catch (err) {
        console.error("Failed to fetch polls:", err);
        setError("Could not load polls. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadPolls();
  }, []);

  // --- Real-time state patching ---
  useEffect(() => {
    setPolls((prevPolls) => {
      let updatedPolls = [...prevPolls];

      // 1️⃣ Handle new poll creation
      if (newPoll) {
        const exists = updatedPolls.some(p => p.id === newPoll.id);
        if (!exists) {
          const newPollItem: PollOut = {
            id: newPoll.id,
            question: newPoll.question,
            options: newPoll.options,
            likes_count: newPoll.likes_count,
            created_by: newPoll.created_by,
          };
          updatedPolls = [newPollItem, ...updatedPolls];
        }
      }

      // 2️⃣ Handle vote updates
      if (latestVote) {
        const { poll_id, option_id, votes_count } = latestVote as VotePayload;
        const pollIndex = updatedPolls.findIndex(p => p.id === poll_id);

        if (pollIndex !== -1) {
          const poll = updatedPolls[pollIndex];
          const optionIndex = poll.options.findIndex(o => o.id === option_id);

          if (optionIndex !== -1 && poll.options[optionIndex].votes_count !== votes_count) {
            // Update vote count immutably
            const updatedOption = {
              ...poll.options[optionIndex],
              votes_count,
            };
            const updatedOptions = [...poll.options];
            updatedOptions[optionIndex] = updatedOption;

            updatedPolls[pollIndex] = { ...poll, options: updatedOptions };
          }
        }
      }

      // 3️⃣ Handle like updates
      if (latestLike) {
        const { poll_id, likes_count } = latestLike as LikePayload;
        const pollIndex = updatedPolls.findIndex(p => p.id === poll_id);

        if (pollIndex !== -1 && updatedPolls[pollIndex].likes_count !== likes_count) {
          updatedPolls[pollIndex] = {
            ...updatedPolls[pollIndex],
            likes_count,
          };
        }
      }

      // Always return a **new array reference** to force React re-render
      return [...updatedPolls];
    });
  }, [newPoll, latestVote, latestLike]);

  return { polls, loading, error };
};
