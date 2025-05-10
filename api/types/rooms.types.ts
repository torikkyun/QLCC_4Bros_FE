import { Pagination } from "./pagination.types";
import { User } from "./users.types";

export interface Room {
  id: number;
  roomNumber: string;
  price: number;
  status: "vacant" | "occupied";
  description: string;
  user: User | null;
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
