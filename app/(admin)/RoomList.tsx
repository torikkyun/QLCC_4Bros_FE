import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRoomList } from "../../hooks/useRoomList";
import BottomTabsAdmin from "@/components/BottomTabsAdmin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";

export default function RoomListScreen() {
  const router = useRouter();
  const { rooms, loading, error, handleDelete, refetch } = useRoomList();

  const [modalVisible, setModalVisible] = useState(false);
  const [roomData, setRoomData] = useState({
    roomNumber: "",
    price: "",
    description: "",
  });

  const handleCreateRoom = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Lỗi", "Không tìm thấy token");
        return;
      }

      const res = await fetch("http://103.167.89.178:3000/api/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...roomData,
          price: parseFloat(roomData.price),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        Alert.alert("Lỗi", err.message || "Không thể tạo phòng");
        return;
      }

      Alert.alert("Thành công", "Tạo phòng thành công!");
      setModalVisible(false);
      setRoomData({ roomNumber: "", price: "", description: "" });

      if (typeof refetch === "function") {
        refetch(); // Nếu hook có hỗ trợ refetch
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi tạo phòng");
    }
  };

  const handleViewRoomDetail = async (room: any) => {
    const fullName = `${room.user?.firstName ?? ""} ${
      room.user?.lastName ?? ""
    }`;
    try {
      await AsyncStorage.multiSet([
        ["roomId", room.id.toString()],
        ["roomNumber", room.roomNumber],
        ["roomPrice", room.price.toString()],
        ["roomStatus", room.status],
        ["roomDescription", room.description],
        ["roomUserName", fullName],
      ]);
      router.push("./roomDetail");
    } catch (err) {
      console.error("Lỗi khi lưu thông tin phòng:", err);
    }
  };

  const RoomCardHeader = ({
    room,
    onDelete,
  }: {
    room: any;
    onDelete: () => void;
  }) => (
    <View className="flex-row justify-between items-center mb-2">
      <View>
        <Text className="text-gray-400">Room</Text>
        <Text className="text-xl font-bold">{room.roomNumber}</Text>
      </View>
      <View className="flex-row space-x-4">
        <Pressable onPress={onDelete}>
          <Ionicons name="trash-outline" size={22} color="black" />
        </Pressable>
        <Pressable onPress={() => handleViewRoomDetail(room)}>
          <Feather name="edit" size={22} color="black" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text className="text-lg font-bold">4Bros</Text>
        <Feather name="menu" size={24} color="black" />
      </View>

      {/* Title */}
      <View className="px-4 mt-2">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-black">Danh sách phòng</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle-outline" size={32} color="black" />
          </TouchableOpacity>
        </View>
        <Text className="text-gray-400 mt-1">
          Thêm sửa xóa danh sách phòng!
        </Text>
      </View>

      {/* Room List */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#5b21b6" />
        ) : error ? (
          <Text className="text-red-500">{error}</Text>
        ) : (
          rooms.map((room) => (
            <View
              key={room.id}
              className="rounded-2xl shadow-md mb-4 p-4"
              style={{ backgroundColor: "rgba(189, 235, 247, 0.8)" }}
            >
              <RoomCardHeader
                room={room}
                onDelete={() => handleDelete(room.id)}
              />
              <View className="flex-row justify-between items-center">
                <Pressable onPress={() => handleViewRoomDetail(room)}>
                  <Text className="text-gray-400">Xem thêm</Text>
                </Pressable>
                <View className="items-end">
                  <Text className="text-gray-400 text-sm">Chi phí tháng</Text>
                  <Text className="text-lg font-bold">${room.price}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="w-4/5 bg-white p-5 rounded-xl">
            <Text className="text-lg font-bold mb-3">Thêm phòng</Text>

            {(["roomNumber", "price", "description"] as const).map((field) => (
              <TextInput
                key={field}
                placeholder={field}
                keyboardType={field === "price" ? "numeric" : "default"}
                value={roomData[field]}
                onChangeText={(text) =>
                  setRoomData({ ...roomData, [field]: text })
                }
                className="border border-gray-300 rounded-md p-3 mb-3 text-gray-400"
              />
            ))}

            <View className="flex-row justify-between space-x-2">
              <TouchableOpacity
                className="flex-1 bg-green-600 py-3 rounded-md items-center"
                onPress={handleCreateRoom}
              >
                <Text className="text-white font-bold">Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-teal-500 py-3 rounded-md items-center"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-white font-bold">Huỷ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomTabsAdmin />
    </View>
  );
}
