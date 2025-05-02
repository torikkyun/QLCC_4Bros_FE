import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomTabs from "@/app/components/BottomTabs";

// Dữ liệu mẫu cho danh sách người dùng
const users = [
  {
    id: "1",
    name: "Daniel",
    score: 9,
    description: "Description...",
    image: require("@/assets/images/daniel.jpg"),
  },
  {
    id: "2",
    name: "Emma",
    score: 8,
    description: "Description...",
    image: require("@/assets/images/fubuki.jpg"),
  },
  {
    id: "3",
    name: "Michael",
    score: 7,
    description: "Description...",
    image: require("@/assets/images/fubuki.jpg"),
  },
];

const { width } = Dimensions.get("window");

const VotesScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = React.useRef<FlatList>(null);

  const renderUser = ({
    item,
    index,
  }: {
    item: (typeof users)[0];
    index: number;
  }) => {
    return (
      <View style={{ width }} className="items-center px-4">
        <View className="w-full max-w-3xs bg-gradient-to-br from-[#917AFD] to-[#6246EA] rounded-3xl overflow-hidden p-4">
          {/* Ảnh người dùng */}
          <View className="p-2">
            <Image
              source={item.image}
              className="aspect-square self-center rounded-t-lg"
              style={{ maxHeight: 250 }}
              resizeMode="contain"
            />
          </View>

          {/* Thông tin người dùng */}
          <View className="items-center px-4">
            <Text className="text-white text-2xl font-bold">{item.name}</Text>
            <Text className="text-white text-base">
              Điểm bình chọn: {item.score}
            </Text>
            <Text className="text-white text-sm mt-1">{item.description}</Text>
          </View>

          {/* Nút bình chọn */}
          <View className="items-center mt-24 pb-2">
            <TouchableOpacity className="bg-white rounded-full py-3 px-8">
              <Text className="text-[#6246EA] font-bold">Bình Chọn</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold ml-2">Bình chọn</Text>
        </View>
        <TouchableOpacity className="bg-teal-500 rounded-full px-4 py-1">
          <Text className="text-white font-medium">Đăng ký</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-grow" />

      {/* Danh sách người dùng */}
      <View className="h-auto">
        <FlatList
          ref={flatListRef}
          data={users}
          renderItem={renderUser}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            setActiveIndex(newIndex);
          }}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </View>

      <View className="flex-grow" />

      <BottomTabs />
    </SafeAreaView>
  );
};

export default VotesScreen;
