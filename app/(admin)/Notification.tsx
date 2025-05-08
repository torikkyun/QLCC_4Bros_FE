import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
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

const NotificationListScreen: React.FC = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  const [editMessage, setEditMessage] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const savedNotifications = await AsyncStorage.getItem("notifications");
        if (savedNotifications) {
          let parsed = JSON.parse(savedNotifications);

          // Chuyển đổi định dạng ngày cũ sang ISO
          parsed = parsed.map((notif: Notification) => {
            if (notif.date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
              const [day, month, year] = notif.date.split("/");
              return { ...notif, date: `${year}-${month}-${day}` }; // e.g., "2025-05-08"
            }
            return notif;
          });

          console.log("Loaded notifications:", parsed);
          setNotifications(parsed);
          // Lưu lại dữ liệu đã chuyển đổi
          await AsyncStorage.setItem("notifications", JSON.stringify(parsed));
        }
      } catch (error) {
        console.error("Lỗi khi tải thông báo:", error);
        Alert.alert("Lỗi", "Không thể tải thông báo!");
      }
    };
    loadNotifications();
  }, []);

  useEffect(() => {
    const saveNotifications = async () => {
      try {
        await AsyncStorage.setItem(
          "notifications",
          JSON.stringify(notifications)
        );
      } catch (error) {
        console.error("Lỗi khi lưu thông báo:", error);
      }
    };
    if (notifications.length > 0) {
      saveNotifications();
    }
  }, [notifications]);

  const deleteNotification = (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa thông báo này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          setNotifications(notifications.filter((notif) => notif.id !== id));
        },
      },
    ]);
  };

  const openEditModal = (id: number, message: string) => {
    setCurrentEditId(id);
    setEditMessage(message);
    setModalVisible(true);
  };

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
    try {
      const dateObj = new Date(notif.date); // Expecting "2025-05-08"
      if (isNaN(dateObj.getTime())) {
        console.warn(`Invalid date for notification ${notif.id}: ${notif.date}`);
        return acc; // Bỏ qua thông báo có ngày không hợp lệ
      }
      const date = dateObj.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }); // e.g., "08/05/2025"
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(notif);
    } catch (error) {
      console.warn(`Error parsing date for notification ${notif.id}:`, error);
    }
    return acc;
  }, {} as { [key: string]: Notification[] });

  return (
    <View className="flex-1 bg-white">
      <View className="p-4 border-b border-gray-200">
        <Text className="text-xl font-bold">Thông báo chung</Text>
      </View>
      <ScrollView className="flex-1 p-4">
        {Object.keys(groupedNotifications).length === 0 ? (
          <Text className="text-gray-500 text-center">
            Không có thông báo nào.
          </Text>
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
                  <TouchableOpacity
                    onPress={() => deleteNotification(notif.id)}
                  >
                    <Text className="text-red-500 font-bold text-lg">X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
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
      <View>
        <BottomTabsAdmin/>
      </View>
    </View>
  );
};

export default NotificationListScreen;
