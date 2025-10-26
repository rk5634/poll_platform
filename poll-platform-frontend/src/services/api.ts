// src/services/api.ts
import axios from "axios";
import {  CreateUserResponse, ListPollsResponse } from "../types/interfaces";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch all polls
export const fetchPolls = async (): Promise<ListPollsResponse[]> => {
  // Your backend endpoint is '/list_polls' under the '/polls' prefix.
  const res = await api.get<ListPollsResponse[]>("/polls/list_polls");
  return res.data; // The response data should be an array of PollOut
};

// Create a new poll
export const createPoll = async (question: string, options: string[], created_by?: string) => {
  const payload = {
    question,
    options: options.map((text) => ({ text })),
    created_by,
  };
  const res = await api.post("/polls/create_poll", payload);
  return res.data;
};

// Vote for an option
export const votePoll = async (pollId: number, optionId: number, voter?: string) => {
  const payload = { option_id: optionId, voter };
  const res = await api.post(`/polls/${pollId}/vote`, payload);
  return res.data;
};

// Toggle like on a poll
export const toggleLike = async (pollId: number, user_identifier?: string) => {
  const payload = { user_identifier };
  const res = await api.post(`/polls/${pollId}/like`, payload);
  return res.data;
};


// Create a new user
export const createUser = async (email: string, name?: string) => {
  const payload = { email, name };
   const res = await api.post<CreateUserResponse>("/users/create_user", payload);
  return res.data;
};