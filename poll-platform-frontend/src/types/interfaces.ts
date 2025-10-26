export interface CreateUserResponse {
    status: "success" | "info" | "error";
    message: string;
    user_id: string;
    email: string;
    name?: string;
  
}



export interface PollOption {
  id: number;
  text: string;
  votes_count: number;
}

export interface ListPollsResponse {
  id: number;
  question: string;
  created_by: string;
  options: PollOption[];
  likes_count: number;
}