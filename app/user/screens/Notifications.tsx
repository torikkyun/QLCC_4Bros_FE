import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { useRouter } from "expo-router";
import BottomTabs from "@/app/components/BottomTabs";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface NotificationGroup {
  id: number;
  date: string;
  messages: string[];
  fullMessages?: string[]; // Thêm optional property này
}

const initialMock: NotificationGroup[] = [
  {
    id: 1,
    date: "06/09/2025",
    messages: [
      "Phát hiện rò rỉ bồn chứa nước ở tầng thượng...",
      "Thang máy tòa nhà có hiện tượng rung lắc nhẹ...",
      "Khu vực đỗ xe đang trong quá quá trình dọn dẹp...",
      "Hệ thống cấp nước sẽ tạm ngừng từ 7h...",
    ],
  },
  {
    id: 2,
    date: "05/09/2025",
    messages: [
      "Hệ thống cấp nước sẽ tạm ngừng từ 7h...",
      "Thang máy tòa nhà có hiện tượng rung lắc nhẹ...",
      "Khu vực đỗ xe đang trong quá quá trình dọn dẹp...",
    ],
  },
];

const truncateMessage = (message: string, wordCount: number = 6) => {
  const words = message.split(" ");
  if (words.length <= wordCount) return message;
  return words.slice(0, wordCount).join(" ") + "...";
};

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] =
    useState<NotificationGroup[]>(initialMock);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const stored = await AsyncStorage.getItem("notifications");
        if (stored) {
          let parsed;
          try {
            parsed = JSON.parse(stored);
          } catch (e) {
            parsed = [
              {
                id: Date.now(),
                title: "Thông báo",
                message: stored,
                date: new Date().toISOString(),
                read: false,
              },
            ];
          }

          const notificationItems: NotificationItem[] = Array.isArray(parsed)
            ? parsed
            : [
                {
                  id: Date.now(),
                  title: "Thông báo",
                  message:
                    typeof parsed === "object"
                      ? JSON.stringify(parsed)
                      : String(parsed),
                  date: new Date().toISOString(),
                  read: false,
                },
              ];

          const grouped: {
            [key: string]: Array<{ preview: string; full: string }>;
          } = {};
          notificationItems.forEach((n) => {
            const dateVN = new Date(n.date).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            if (!grouped[dateVN]) grouped[dateVN] = [];
            grouped[dateVN].push({
              preview: truncateMessage(n.message),
              full: n.message,
            });
          });

          const extraGroups: NotificationGroup[] = Object.entries(grouped).map(
            ([date, messages], idx) => ({
              id: Date.now() + idx,
              date,
              messages: messages.map((m) => m.preview),
              fullMessages: messages.map((m) => m.full),
            })
          );

          setNotifications((prev) => [...extraGroups, ...prev]);
        }
      } catch (error) {
        console.error("Lỗi khi load notifications:", error);
      }
    };

    loadNotifications();
  }, []);

  const getFullMessage = (groupIndex: number, messageIndex: number) => {
    if (notifications[groupIndex]?.fullMessages) {
      return notifications[groupIndex].fullMessages[messageIndex];
    }
    return notifications[groupIndex]?.messages[messageIndex] || "";
  };

  return (
    <View className="flex-1 bg-gray-50 pt-14 px-4">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full bg-gray-100"
        >
          <ArrowLeftIcon size={20} color="#4b5563" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-3 text-gray-800">
          Thông báo chung
        </Text>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {notifications.map((group, groupIndex) => (
          <View key={groupIndex} className="mb-6">
            <View className="bg-gray-100 px-4 py-2 rounded-md mb-3">
              <Text className="text-sm font-medium text-gray-700">
                Thông báo: {group.date}
              </Text>
            </View>

            <View className="bg-white rounded-xl shadow shadow-gray-200 overflow-hidden">
              {group.messages.map((msg, messageIndex) => (
                <TouchableOpacity
                  key={messageIndex}
                  onPress={() =>
                    router.push({
                      pathname: "./NotificationsDetail",
                      params: {
                        date: group.date,
                        preview: msg,
                        content: getFullMessage(groupIndex, messageIndex),
                      },
                    })
                  }
                  className={`px-5 py-3 ${
                    messageIndex !== group.messages.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <Text className="text-gray-600">{msg}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <View className="mb-6" />
      </ScrollView>

      <BottomTabs />
    </View>
  );
}
