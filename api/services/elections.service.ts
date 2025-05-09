import { api } from "../client";
import { ENDPOINTS } from "../config";
import { getElectionResults } from "./homeUser.service";

export const electionsService = {
  getElectionResults,
};
