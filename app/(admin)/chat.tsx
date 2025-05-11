
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BottomTabsAdmin from "@/components/BottomTabsAdmin";

// Định nghĩa kiểu cho một cuộc trò chuyện
interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
}

const ChatScreen: React.FC = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");

  // Dữ liệu giả lập cho danh sách chat
  const chats: Chat[] = [
    {
      id: "1",
      name: "John Doe",
      lastMessage: "Hey, how are you?",
      time: "10:30 AM",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: "2",
      name: "Jane Smith",
      lastMessage: "See you tomorrow!",
      time: "Yesterday",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: "3",
      name: "Alex Brown",
      lastMessage: "Can we meet at 5?",
      time: "Monday",
      avatar: "https://via.placeholder.com/40",
    },
  ];

  // Lọc danh sách chat dựa trên tìm kiếm
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Xử lý điều hướng đến chi tiết chat
  const goToChatDetail = (chatId: string) => {
    router.push(`/ChatDetail?chatId=${chatId}`); // Placeholder, bạn có thể thay đổi đường dẫn
  };

  // Render mỗi item chat
  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      onPress={() => goToChatDetail(item.id)}
      className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-md border border-gray-100"
    >
      <Image
        source={{ uri: item.avatar }}
        className="w-12 h-12 rounded-full mr-4"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
        <Text className="text-sm text-gray-600 mt-1">{item.lastMessage}</Text>
      </View>
      <Text className="text-sm text-gray-500">{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 p-5 relative">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#1a3c5e" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-[#1a3c5e] ml-3">Chat</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="menu" size={28} color="#1a3c5e" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center bg-white p-4 rounded-xl mb-6 shadow-md border border-gray-100">
        <Ionicons name="search" size={22} color="#888" />
        <TextInput
          className="flex-1 mx-3 text-base text-gray-800"
          placeholder="Tìm kiếm cuộc trò chuyện"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Ionicons name="options" size={22} color="#888" />
      </View>

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        keyExtractor={(item: Chat) => item.id}
        renderItem={renderChatItem}
        ListEmptyComponent={
          <View className="text-center mt-4">
            <Text className="text-gray-500 text-base mb-4">
              Chưa có cuộc trò chuyện nào
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0">
        <BottomTabsAdmin />
      </View>
    </View>
  );
};

export default ChatScreen;

