import { Candidate } from "./candidates.types";

export interface VotePayload {
  electionId: number;
  candidateId: number;
}

export interface VoteResponse {
  voteAt: string;
  userId: number;
  electionId: number;
  candidateId: number;
}

export interface VoteStatus {
  hasVoted: boolean;
  electionStatus: string;
  candidateId: Candidate | null;
}
