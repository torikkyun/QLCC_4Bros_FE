import { User } from "./users.types";

interface ElectionResult {
  candidateId: number;
  description: string;
  user: User;
  voteCount: number | string;
}
