import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import BottomTabsAdmin from "@/components/BottomTabsAdmin";

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const CreateNotificationScreen: React.FC = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");

  // Lấy ngày hiện tại
  const currentDate = new Date().toISOString().split("T")[0]; // e.g., "2025-05-08"
  const displayDate = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }); // e.g., "08/05/2025"

  const createNotification = async () => {
    if (!message.trim()) {
      Alert.alert("Lỗi", "Nội dung thông báo không được để trống!");
      return;
    }

    const newNotification: Notification = {
      id: Date.now(),
      title: "Thông báo chung",
      message: message.trim(),
      date: currentDate, // Lưu dưới dạng ISO
      read: false,
    };

    try {
      const savedNotifications = await AsyncStorage.getItem("notifications");
      const notifications = savedNotifications
        ? JSON.parse(savedNotifications)
        : [];

      const updatedNotifications = [...notifications, newNotification];
      await AsyncStorage.setItem(
        "notifications",
        JSON.stringify(updatedNotifications)
      );
      console.log("Saved notifications:", updatedNotifications); // Debug

      Alert.alert("Thành công", "Thông báo đã được tạo!", [
        {
          text: "OK",
          onPress: () => {
            setMessage("");
            router.push("/(admin)/Notification"); // Chuyển đến danh sách
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu thông báo. Vui lòng thử lại!");
      console.error(error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="p-4 border-b border-gray-200">
        <Text className="text-xl font-bold">Thông báo chung</Text>
        <Text className="text-gray-500 mt-1">Thông báo: {displayDate}</Text>
      </View>
      <View className="p-4 flex-1">
        <TextInput
          className="border border-gray-300 rounded p-2 h-40 bg-white"
          placeholder="Nội dung thông báo..."
          value={message}
          onChangeText={setMessage}
          multiline
          textAlignVertical="top"
        />
      </View>
      <View className="p-4">
        <TouchableOpacity
          className="bg-purple-500 py-3 rounded-lg"
          onPress={createNotification}
        >
          <Text className="text-white text-center font-semibold">
            Tạo Thông Báo
          </Text>
        </TouchableOpacity>
      </View>
      <BottomTabsAdmin />
    </View>
  );
};

export default CreateNotificationScreen;
