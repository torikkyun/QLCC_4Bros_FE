import { api } from "../client";
import { ENDPOINTS } from "../config";

export const votesService = {
  vote: async (payload: VotePayload): Promise<VoteResponse> => {
    return api.post<VoteResponse>(ENDPOINTS.VOTES.VOTE, payload);
  },
  checkVoteStatus: async (electionId: number): Promise<VoteStatus> => {
    return api.get<VoteStatus>(ENDPOINTS.VOTES.CHECK_STATUS(electionId));
  },
};
