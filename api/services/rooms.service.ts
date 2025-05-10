import { api } from "../client";
import { ENDPOINTS } from "../config";
import { RoomFilterParams, RoomResponse } from "../types/rooms.types";

export const roomsService = {
  // Lấy danh sách phòng
  getRooms: async (params?: RoomFilterParams): Promise<RoomResponse> => {
    return api.get<RoomResponse>(ENDPOINTS.ROOMS.LIST, { params });
  },
};
