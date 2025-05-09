import { api } from "../client";
import { ENDPOINTS } from "../config";
import {
  CandidateFilterParams,
  CandidateResponse,
} from "../types/candidates.types";

export const candidatesService = {
  getCandidates: async (
    params?: CandidateFilterParams
  ): Promise<CandidateResponse> => {
    return api.get<CandidateResponse>(ENDPOINTS.CANDIDATES.LIST, { params });
  },
};
