import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomTabs from "@/app/components/BottomTabs";
import { Room } from "@/api/types/room.types";
import { roomService } from "@/api/services/room.service";

const RoomScreen = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusQuery, setStatusQuery] = useState<
    "vacant" | "occupied" | undefined
  >();

  useEffect(() => {
    fetchRooms();
  }, [statusQuery]);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await roomService.getRooms({
        status: statusQuery,
        page: 1,
        limit: 10,
      });
      setRooms(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu phòng:", err);
      setError("Không thể tải dữ liệu phòng");
      setLoading(false);
    }
  };

  // Lọc phòng theo từ khóa tìm kiếm
  const filteredRooms = rooms.filter((room) =>
    room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Hàm xác định màu nền dựa trên trạng thái phòng
  const getRoomBackgroundColor = (status: string) => {
    switch (status) {
      case "vacant":
        return "bg-green-400";
      case "occupied":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  // Hàm xác định màu nút dựa trên trạng thái phòng
  const getButtonStyle = (status: string) => {
    return status === "vacant" ? "bg-blue-500" : "bg-gray-400";
  };

  // Hàm xác định trạng thái phòng bằng tiếng Việt
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3">
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Rentaxo</Text>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Tiêu đề */}
      <Text className="text-2xl font-bold px-4 py-2 text-[#1a2b47]">
        Danh sách phòng
      </Text>

      {/* Thanh tìm kiếm */}
      <View className="mx-4 mb-4 flex-row items-center bg-gray-100 rounded-full px-4 py-2">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          className="flex-1 ml-2 text-base"
          placeholder="Tìm kiếm phòng theo số"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Nút lọc theo trạng thái */}
      <View className="flex-row justify-center space-x-2 mb-4 px-4">
        <TouchableOpacity
          className={`py-2 px-4 rounded-full ${
            statusQuery === undefined ? "bg-blue-500" : "bg-gray-200"
          }`}
          onPress={() => setStatusQuery(undefined)}
        >
          <Text
            className={`${
              statusQuery === undefined ? "text-white" : "text-gray-700"
            } font-medium`}
          >
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`py-2 px-4 rounded-full ${
            statusQuery === "vacant" ? "bg-green-500" : "bg-gray-200"
          }`}
          onPress={() => setStatusQuery("vacant")}
        >
          <Text
            className={`${
              statusQuery === "vacant" ? "text-white" : "text-gray-700"
            } font-medium`}
          >
            Phòng trống
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`py-2 px-4 rounded-full ${
            statusQuery === "occupied" ? "bg-red-500" : "bg-gray-200"
          }`}
          onPress={() => setStatusQuery("occupied")}
        >
          <Text
            className={`${
              statusQuery === "occupied" ? "text-white" : "text-gray-700"
            } font-medium`}
          >
            Đã thuê
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hiển thị trạng thái tải */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="mt-2">Đang tải danh sách phòng...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center px-4">
          <Ionicons name="alert-circle" size={50} color="red" />
          <Text className="text-red-500 text-center mt-2">{error}</Text>
          <TouchableOpacity
            className="mt-4 bg-blue-500 px-4 py-2 rounded-full"
            onPress={() => {
              setLoading(true);
              setError(null);
              // Thực hiện lại việc tải dữ liệu
            }}
          >
            <Text className="text-white">Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Danh sách phòng */
        <ScrollView className="px-4">
          {filteredRooms.length === 0 ? (
            <View className="py-8 items-center">
              <Ionicons name="search" size={50} color="gray" />
              <Text className="text-gray-500 mt-2">Không tìm thấy phòng</Text>
            </View>
          ) : (
            filteredRooms.map((room) => (
              <View
                key={room.id}
                className={`${getRoomBackgroundColor(
                  room.status
                )} rounded-lg p-4 mb-4`}
              >
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="text-base font-medium">Phòng</Text>
                    <Text className="text-2xl font-bold text-[#1a2b47]">
                      {room.roomNumber}
                    </Text>
                    <Text className="mt-2">{room.description}</Text>
                    <View className="mt-2 bg-black/10 px-3 py-1 rounded-full self-start">
                      <Text>{getStatusText(room.status)}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    className={`${getButtonStyle(
                      room.status
                    )} px-6 py-2 rounded-full`}
                    disabled={room.status !== "vacant"}
                  >
                    <Text className="text-white font-medium">Thuê</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row justify-end mt-2">
                  <Text className="text-base">Chi phí tháng</Text>
                </View>
                <View className="flex-row justify-end">
                  <Text className="text-xl font-bold">${room.price}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
      <BottomTabs />
    </SafeAreaView>
  );
};

export default RoomScreen;
