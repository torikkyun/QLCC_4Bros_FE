import { useEffect, useState } from "react";
import { fetchRooms, deleteRoom } from "@/api/services/roomList.service";

export function useRoomList() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await fetchRooms();
      setRooms(data);
    } catch (err) {
      setError("Đã xảy ra lỗi khi tải phòng");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRoom(id);
      setRooms((prev) => prev.filter((room) => room.id !== id));
    } catch (err) {
      console.error("Xóa phòng thất bại:", err);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  return { rooms, loading, error, handleDelete };
}
