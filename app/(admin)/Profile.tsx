
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import BottomTabsAdmin from "@/components/BottomTabsAdmin";

const ProfileScreen = () => {
  const router = useRouter();

  // Hàm đăng xuất
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      router.push("/Login");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại.");
    }
  };

  // Xử lý điều hướng đến PersonalDetail
  const goToPersonalDetail = () => {
    router.push("/(admin)/PersonalDetail");
  };

    const goTochat = () => {
    router.push("/(admin)/chat");
  };

  return (
    <View className="flex-1 bg-white p-5 relative">
      {/* Header Profile */}
      <View className="items-center mt-10">
        <Image
          source={{ uri: "https://via.placeholder.com/100" }} // Thay bằng ảnh thật nếu có
          className="w-24 h-24 rounded-full"
        />
        <Text className="text-2xl font-bold text-[#1a3c5e] mt-3">4B bot</Text>
        <Text className="text-gray-600">fourbros@gmail.com</Text>
      </View>

      {/* Menu Options */}
      <View className="mt-10">
        <TouchableOpacity
          onPress={goToPersonalDetail}
          className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl mb-4"
        >
          <View className="flex-row items-center">
            <Ionicons name="person" size={24} color="#1a3c5e" />
            <Text className="text-lg text-gray-800 ml-3">Personal details</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goTochat} // Placeholder, có thể thêm logic khác nếu cần
          className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl mb-4"
        >
          <View className="flex-row items-center">
            <Ionicons name="settings" size={24} color="#1a3c5e" />
            <Text className="text-lg text-gray-800 ml-3">chat</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {}} // Placeholder, có thể thêm logic khác nếu cần
          className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl mb-4"
        >
          <View className="flex-row items-center">
            <Ionicons name="help-circle" size={24} color="#1a3c5e" />
            <Text className="text-lg text-gray-800 ml-3">FAQ</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Log out Button */}
      <TouchableOpacity
        onPress={logout}
        className="bg-violet-700 p-4 rounded-xl mt-10"
      >
        <Text className="text-white text-center text-lg font-medium">Log out</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0">
        <BottomTabsAdmin />
      </View>
    </View>
  );
};

export default ProfileScreen;

