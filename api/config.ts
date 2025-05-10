export const API_CONFIG = {
  BASE_URL: "http://103.167.89.178:3000/api",
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const ENDPOINTS = {
  USERS: {
    ME: "/user/me",
  },
  ROOMS: {
    LIST: "/room",
    // DETAIL: (id: number) => `/rooms/${id}`,
    // BOOK: (id: number) => `/rooms/${id}/book`,
  },
  CANDIDATES: {
    LIST: "/candidate",
  },
  ELECTIONS: {
    RESULTS: (id: number) => `/election/${id}/results`,
  },
  VOTES: {
    VOTE: "/vote",
    CHECK_STATUS: (electionId: number) => `/vote/${electionId}/check-status`,
  },
};
