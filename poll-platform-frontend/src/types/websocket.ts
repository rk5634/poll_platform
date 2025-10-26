// src/types/websocket.ts

// The payloads sent by your FastAPI backend for each event type
// src/types/websocket.ts

export interface PollOption {
  id: number;
  text: string;
  votes_count: number;
}

export interface PollCreatedPayload {
  id: number;
  question: string;
  created_by: string;       // ✅ add this
  options: PollOption[];    // ✅ add this
  likes_count: number;      // ✅ add this
}


export interface VotePayload {
  poll_id: number;
  option_id: number;
  votes_count: number;
}

export interface LikePayload {
  poll_id: number;
  likes_count: number;
}

// Union type for all possible message structures received via WebSocket
export type PollUpdateMessage =
  | { type: "poll_created"; payload: PollCreatedPayload }
  | { type: "vote"; payload: VotePayload }
  | { type: "like"; payload: LikePayload }
  | { type: string; payload: any }; // Fallback for unhandled types

// The structure of the state returned by the usePollUpdates hook
export interface PollUpdatesState {
  newPoll: PollCreatedPayload | null;
  latestVote: VotePayload | null;
  latestLike: LikePayload | null;
}
