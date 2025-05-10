import { Pagination } from "./pagination.types";
import { User } from "./users.types";

export interface Candidate {
  id: number;
  description: string;
  user: User;
}

export interface CandidateResponse {
  data: Candidate[];
  pagination: Pagination;
  statusCode?: Number;
}

export interface CandidateFilterParams {
  page?: number;
  limit?: number;
}

export interface CandidateCreateRequest {
  description: string;
}
