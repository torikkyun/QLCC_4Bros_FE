import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import BottomTabsAdmin from "@/components/BottomTabsAdmin";

// Định nghĩa giao diện Notification
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
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Hàm tạo thông báo mới
  const createNotification = async () => {
    if (!message.trim()) {
      Alert.alert("Lỗi", "Nội dung thông báo không được để trống!");
      return;
    }

    const newNotification: Notification = {
      id: Date.now(),
      title: "Thông báo chung",
      message,
      date: new Date().toISOString().split("T")[0],
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
      Alert.alert("Thành công", "Thông báo đã được tạo!", [
        {
          text: "OK",
          onPress: () => {
            setMessage("");
            router.push("/admin/screens/notification");
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
      {/* Header */}
      <View className="p-4 border-b border-gray-200">
        <Text className="text-xl font-bold">Thông báo chung</Text>
        <Text className="text-gray-500 mt-1">Thông báo: {currentDate}</Text>
      </View>

      {/* Ô nhập nội dung thông báo */}
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

      {/* Nút "Tạo Thông Báo" */}
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
