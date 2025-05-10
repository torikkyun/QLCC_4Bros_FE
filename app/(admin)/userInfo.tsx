import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5, Ionicons, Feather } from "@expo/vector-icons";
import { fetchRoomByEmail } from "../../api/services/roomByEmail.service";
import { useRouter } from "expo-router";
import BottomTabsAdmin from "@/components/BottomTabsAdmin";

export default function RoomDetail() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [room, setRoom] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const name = await AsyncStorage.getItem("selectedUserName");
      const email = await AsyncStorage.getItem("selectedUserEmail");
      setUserName(name);
      setUserEmail(email);

      const roomData = await fetchRoomByEmail();
      setRoom(roomData);
    };

    fetchUserData();
  }, []);

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text className="text-lg font-bold">4Bros</Text>
        <Feather name="menu" size={24} color="black" />
      </View>

      {/* User Info */}
      <View className="flex-row items-center mb-6">
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View>
          <Text className="text-base font-semibold text-gray-800">
            {userName || "Loading..."}
          </Text>
          <Text className="text-xs text-purple-500 font-semibold">
            {userEmail || "Loading email..."}
          </Text>
        </View>
      </View>

      {/* Services */}
      <Text className="text-xl font-bold text-gray-700 mb-2">
        Thông tin phòng
      </Text>
      <View className="flex-row flex-wrap gap-4 mb-6">
        <View className="flex-row items-center space-x-1">
          <FontAwesome5 name="dollar-sign" size={20} color="#444" />
          <Text className="text-gray-700 text-sm">Giá: ${room?.price}</Text>
        </View>
        <View className="flex-row items-center space-x-1">
          <FontAwesome5 name="exclamation-circle" size={18} color="#444" />
          <Text className="text-gray-700 text-sm">
            Trạng thái: {room?.status}
          </Text>
        </View>
      </View>

      {/* Room Box */}
      <View
        className="bg-gray-100 rounded-xl justify-center items-center h-32 mb-6"
        style={{ height: "30%" }}
      >
        <Text className="text-7xl font-bold text-green-500">
          {room?.roomNumber || "Not Found"}
        </Text>
      </View>

      {/* Notes */}
      <Text className="text-sm font-semibold text-gray-700 mb-2">Ghi chú</Text>
      <View className="bg-gray-100 rounded-xl p-3" style={{ height: "30%" }}>
        <Text className="text-gray-600 text-sm">
          {room?.description || "Không có ghi chú"}
        </Text>
      </View>
      <BottomTabsAdmin />
    </View>
  );
}
