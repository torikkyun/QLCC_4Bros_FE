import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRoomList } from "../hooks/RoomList.hook";
import BottomTabs from "@/app/components/BottomTabs";

export default function RoomListScreen() {
  const router = useRouter();
  const { rooms, loading, error, handleDelete } = useRoomList();

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
        <Pressable onPress={() => router.push("/login")}>
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
        <Text className="text-lg font-bold">Rentaxo</Text>
        <Feather name="menu" size={24} color="black" />
      </View>

      {/* Title */}
      <View className="px-4 mt-2">
        <Text className="text-2xl font-bold text-black">Danh sách phòng</Text>
        <Text className="text-gray-400 mt-1">
          Just add the property{"\n"}to list on worldwide market!
        </Text>
      </View>

      {/* Room List */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 100,
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
              className="bg-white rounded-2xl shadow-md mb-4 p-4"
            >
              <RoomCardHeader
                room={room}
                onDelete={() => handleDelete(room.id)}
              />
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400">View More Info</Text>
                <View className="items-end">
                  <Text className="text-gray-400 text-sm">Chi phí tháng</Text>
                  <Text className="text-lg font-bold">${room.price}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View className="flex-row justify-around items-center h-16 border-t border-gray-200">
        <BottomTabs />
      </View>
    </View>
  );
}
