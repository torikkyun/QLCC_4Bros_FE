export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "manager" | "user";
}

export interface Room {
  id: number;
  roomNumber: string;
  price: number;
  status: "vacant" | "occupied";
  description: string;
  user: User | null;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RoomResponse {
  data: Room[];
  pagination: Pagination;
}

export interface RoomFilterParams {
  page?: number;
  limit?: number;
  status?: "vacant" | "occupied";
}
