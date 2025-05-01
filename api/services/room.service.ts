import { api } from "../client";
import { ENDPOINTS } from "../config";
import { RoomFilterParams, RoomResponse } from "../types/room.types";

export const roomService = {
  // Lấy danh sách phòng
  getRooms: async (params?: RoomFilterParams): Promise<RoomResponse> => {
    return api.get<RoomResponse>(ENDPOINTS.ROOMS.LIST, { params });
  },
};
