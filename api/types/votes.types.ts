interface VotePayload {
  electionId: number;
  candidateId: number;
}

interface VoteResponse {
  voteAt: string;
  userId: number;
  electionId: number;
  candidateId: number;
}

interface VoteStatus {
  hasVoted: boolean;
  electionStatus: string;
}
