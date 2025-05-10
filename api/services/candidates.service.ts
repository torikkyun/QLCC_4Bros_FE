import { api } from "../client";
import { ENDPOINTS } from "../config";
import {
  CandidateCreateRequest,
  CandidateFilterParams,
  CandidateResponse,
} from "../types/candidates.types";

export const candidatesService = {
  getCandidates: async (
    params?: CandidateFilterParams
  ): Promise<CandidateResponse> => {
    return api.get<CandidateResponse>(ENDPOINTS.CANDIDATES.LIST, { params });
  },

  createCandidate: async (data: CandidateCreateRequest) => {
    return api.post(ENDPOINTS.CANDIDATES.CREATE, data);
  },
};
