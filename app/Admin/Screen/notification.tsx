import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Modal, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

// Định nghĩa giao diện Notification
interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const NotificationListScreen: React.FC = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  const [editMessage, setEditMessage] = useState("");

  // Load thông báo từ AsyncStorage khi khởi động
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const savedNotifications = await AsyncStorage.getItem("notifications");
        if (savedNotifications) {
          setNotifications(JSON.parse(savedNotifications));
        }
      } catch (error) {
        console.error("Lỗi khi tải thông báo:", error);
      }
    };
    loadNotifications();
  }, []);

  // Lưu thông báo vào AsyncStorage mỗi khi danh sách thay đổi
  useEffect(() => {
    const saveNotifications = async () => {
      try {
        await AsyncStorage.setItem("notifications", JSON.stringify(notifications));
      } catch (error) {
        console.error("Lỗi khi lưu thông báo:", error);
      }
    };
    if (notifications.length > 0) {
      saveNotifications();
    }
  }, [notifications]);

  // Xóa thông báo
  const deleteNotification = (id: number) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa thông báo này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => {
            setNotifications(notifications.filter((notif) => notif.id !== id));
          },
        },
      ]
    );
  };

  // Mở modal chỉnh sửa
  const openEditModal = (id: number, message: string) => {
    setCurrentEditId(id);
    setEditMessage(message);
    setModalVisible(true);
  };

  // Lưu thông báo đã chỉnh sửa
  const saveEditedNotification = () => {
    if (currentEditId === null || !editMessage.trim()) {
      Alert.alert("Lỗi", "Nội dung thông báo không được để trống!");
      return;
    }

    setNotifications(
      notifications.map((notif) =>
        notif.id === currentEditId ? { ...notif, message: editMessage } : notif
      )
    );
    setModalVisible(false);
    setCurrentEditId(null);
    setEditMessage("");
  };

  // Nhóm thông báo theo ngày
  const groupedNotifications = notifications.reduce((acc, notif) => {
    const date = new Date(notif.date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(notif);
    return acc;
  }, {} as { [key: string]: Notification[] });

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="p-4 border-b border-gray-200">
        <Text className="text-xl font-bold">Thông báo chung</Text>
      </View>

      {/* Danh sách thông báo */}
      <ScrollView className="flex-1 p-4">
        {Object.keys(groupedNotifications).length === 0 ? (
          <Text className="text-gray-500 text-center">Không có thông báo nào.</Text>
        ) : (
          Object.keys(groupedNotifications).map((date) => (
            <View key={date} className="mb-4">
              <Text className="text-gray-500 mb-2">Thông báo: {date}</Text>
              {groupedNotifications[date].map((notif) => (
                <View
                  key={notif.id}
                  className="flex-row justify-between items-center py-2 border-b border-gray-200"
                >
                  <TouchableOpacity
                    className="flex-1"
                    onPress={() => openEditModal(notif.id, notif.message)}
                  >
                    <Text className="text-black">{notif.message}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteNotification(notif.id)}>
                    <Text className="text-red-500 font-bold text-lg">X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal chỉnh sửa */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-4 rounded-lg w-4/5">
            <Text className="text-lg font-bold mb-4">Chỉnh sửa thông báo</Text>
            <TextInput
              className="border border-gray-300 rounded p-2 h-40 bg-white"
              value={editMessage}
              onChangeText={setEditMessage}
              multiline
              textAlignVertical="top"
            />
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity
                className="bg-gray-500 py-2 px-4 rounded mr-2"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-white">Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-500 py-2 px-4 rounded"
                onPress={saveEditedNotification}
              >
                <Text className="text-white">Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Thanh điều hướng dưới cùng */}
      <View className="flex-row justify-around py-3 border-t border-gray-200 bg-white">
        <TouchableOpacity className="items-center" onPress={() => router.push("/")}>
          <Text className="text-blue-500">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-gray-500">User List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center"
          onPress={() => router.push("/CreateNotification")}
        >
          <Text className="text-3xl text-purple-500">+</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-gray-500">Room List</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-gray-500">Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NotificationListScreen;
