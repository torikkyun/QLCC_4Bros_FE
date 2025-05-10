import { api } from "../client";
import { ENDPOINTS } from "../config";

export const usersService = {
  getMe: async () => {
    return api.get(ENDPOINTS.USERS.ME);
  },
};
