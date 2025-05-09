import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomTabs from "@/components/BottomTabs";
import { Room } from "@/api/types/rooms.types";
import { roomsService } from "@/api/services/rooms.service";
import { router } from "expo-router";

const RoomScreen = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [buttonColor, setButtonColor] = useState<
    "vacant" | "occupied" | undefined
  >(undefined);

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
      setLoading(false);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu phòng:", err);
      setLoading(false);
    }
  };

  // Lọc phòng theo từ khóa tìm kiếm
  const filteredRooms = rooms.filter((room) =>
    room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleStatusFilter = async (
    status: "vacant" | "occupied" | undefined
  ) => {
    try {
      fetchRooms(status);
    } catch (err) {
      console.error("Lỗi khi lọc phòng:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4 bg-white shadow-sm">
        <TouchableOpacity
          className="p-2 rounded-full hover:bg-gray-100"
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#1a2b47" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#1a2b47]">4Bros</Text>
        <TouchableOpacity className="p-2 rounded-full hover:bg-gray-100">
          <Ionicons name="menu" size={24} color="#1a2b47" />
        </TouchableOpacity>
      </View>

      {/* Tiêu đề */}
      <Text className="text-3xl font-bold px-6 py-4 text-[#1a2b47]">
        Danh sách phòng
      </Text>

      {/* Thanh tìm kiếm */}
      <View className="mx-6 mb-6">
        <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
          <Ionicons name="search" size={20} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-3 text-base text-gray-700"
            placeholder="Tìm kiếm phòng theo số"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      {/* Nút lọc theo trạng thái */}
      <View className="flex-row justify-center gap-x-3 mb-6 px-6">
        <TouchableOpacity
          className={`py-2.5 px-6 rounded-xl ${
            buttonColor == undefined
              ? "bg-blue-500 shadow-lg"
              : "bg-white border border-gray-200"
          }`}
          onPress={() => handleStatusFilter(undefined)}
        >
          <Text
            className={`${
              buttonColor == undefined ? "text-white" : "text-gray-700"
            } font-semibold`}
          >
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatusFilter("vacant")}>
          <Text
            className={`${
              buttonColor == "vacant" ? "text-white" : "text-gray-700"
            } font-semibold py-2.5 px-6 rounded-xl ${
              buttonColor == "vacant"
                ? "bg-green-500 shadow-lg"
                : "bg-white border border-gray-200"
            }`}
          >
            Phòng trống
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatusFilter("occupied")}>
          <Text
            className={`${
              buttonColor == "occupied" ? "text-white" : "text-gray-700"
            } font-semibold py-2.5 px-6 rounded-xl ${
              buttonColor == "occupied"
                ? "bg-red-500 shadow-lg shadow-red-500/50"
                : "bg-white border border-gray-200"
            }`}
          >
            Đã thuê
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading và Error states */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-gray-600 font-medium">
            Đang tải danh sách phòng...
          </Text>
        </View>
      ) : (
        <ScrollView className="px-6">
          {filteredRooms.length === 0 ? (
            <View className="py-12 items-center">
              <Ionicons name="search" size={60} color="#94a3b8" />
              <Text className="text-gray-500 text-lg font-medium mt-4">
                Không tìm thấy phòng
              </Text>
            </View>
          ) : (
            filteredRooms.map((room) => (
              <View
                key={room.id}
                className={`bg-white rounded-2xl p-6 mb-6 shadow-lg ${
                  room.status === "vacant"
                    ? "border-l-4 border-green-500"
                    : "border-l-4 border-red-500"
                }`}
              >
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="text-gray-500 font-medium">Phòng</Text>
                    <Text className="text-3xl font-bold text-[#1a2b47] mt-1">
                      {room.roomNumber}
                    </Text>
                    <Text className="mt-3 text-gray-600">
                      {room.description}
                    </Text>
                    <View
                      className={`mt-4 px-4 py-2 rounded-xl self-start ${
                        room.status === "vacant"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <Text className="font-semibold">
                        {getStatusText(room.status)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    className={`${
                      room.status === "vacant"
                        ? "bg-blue-500 shadow-lg shadow-blue-500/50"
                        : "bg-gray-300"
                    } px-8 py-3 rounded-xl`}
                    disabled={room.status !== "vacant"}
                  >
                    <Text className="text-white font-semibold">Thuê</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row justify-end mt-4">
                  <View>
                    <Text className="text-gray-500 text-right">
                      Chi phí tháng
                    </Text>
                    <Text className="text-2xl font-bold text-[#1a2b47] mt-1">
                      ${room.price}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
      <View className="mt-auto">
        <BottomTabs />
      </View>
    </View>
  );
};

export default RoomScreen;
