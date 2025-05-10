import { useState, useEffect } from "react";
import { Room } from "@/api/types/rooms.types";
import { roomsService } from "@/api/services/rooms.service";

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [buttonColor, setButtonColor] = useState<
    "vacant" | "occupied" | undefined
  >(undefined);
  const [selectedBlock, setSelectedBlock] = useState<string>("");
  const [selectedFloor, setSelectedFloor] = useState<string>("");

  useEffect(() => {
    fetchRooms(buttonColor);
  }, [buttonColor]);

  const fetchRooms = async (status?: "vacant" | "occupied" | undefined) => {
    setLoading(true);
    try {
      const response = await roomsService.getRooms({
        page: 1,
        limit: 10,
        status: status,
      });
      setRooms(response.data);
      setButtonColor(status);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu phòng:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = async (
    status: "vacant" | "occupied" | undefined
  ) => {
    try {
      fetchRooms(status);
    } catch (err) {
      console.error("Lỗi khi lọc phòng:", err);
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchSearch = room.roomNumber
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchBlock = selectedBlock
      ? room.roomNumber.charAt(0) === selectedBlock
      : true;
    const matchFloor = selectedFloor
      ? room.roomNumber.charAt(1) === selectedFloor
      : true;
    return matchSearch && matchBlock && matchFloor;
  });

  const getAvailableBlocks = () => {
    const blocks = new Set(rooms.map((room) => room.roomNumber.charAt(0)));
    return Array.from(blocks).sort();
  };

  const getAvailableFloors = () => {
    const floors = new Set(rooms.map((room) => room.roomNumber.charAt(1)));
    return Array.from(floors).sort();
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "vacant":
        return "Trống";
      case "occupied":
        return "Đã thuê";
      default:
        return "Không xác định";
    }
  };

  return {
    rooms: filteredRooms,
    loading,
    searchQuery,
    setSearchQuery,
    buttonColor,
    handleStatusFilter,
    getStatusText,
    selectedBlock,
    setSelectedBlock,
    selectedFloor,
    setSelectedFloor,
    getAvailableBlocks,
    getAvailableFloors,
  };
};
