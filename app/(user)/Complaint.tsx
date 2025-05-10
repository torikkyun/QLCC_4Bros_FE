import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Complaint = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center gap-x-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-50"
          >
            <Ionicons name="chevron-back" size={24} color="#1a2b47" />
          </TouchableOpacity>
          <View className="flex-row items-center">
            <Image
              source={require("@/assets/images/fubuki.jpg")}
              className="w-10 h-10 rounded-full"
            />
            <Text className="ml-3 text-lg font-semibold text-[#1a2b47]">
              4B Bot
            </Text>
          </View>
        </View>
        <TouchableOpacity className="p-2 rounded-full hover:bg-gray-50">
          <Ionicons name="ellipsis-horizontal" size={24} color="#1a2b47" />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <ScrollView
        className="flex-1 px-4 py-6"
        showsVerticalScrollIndicator={false}
      >
        {/* User Message */}
        <View className="flex-row justify-end mb-4">
          <View className="bg-violet-600 rounded-2xl rounded-tr-none p-4 max-w-[85%]">
            <Text className="text-white text-base">
              How is the property condition?
            </Text>
            <Text className="text-xs text-violet-200 text-right mt-1.5">
              14:22
            </Text>
          </View>
        </View>

        {/* Bot Message */}
        <View className="flex-row mb-4">
          <View className="bg-gray-100 rounded-2xl rounded-tl-none p-4 max-w-[85%]">
            <Text className="text-gray-800 text-base">
              It's nice myan for sure.{"\n"}You will love it
            </Text>
            <Text className="text-xs text-gray-400 text-right mt-1.5">
              14:24
            </Text>
          </View>
        </View>

        {/* User Message */}
        <View className="flex-row justify-end mb-4">
          <View className="bg-violet-600 rounded-2xl rounded-tr-none p-4 max-w-[85%]">
            <Text className="text-white text-base">
              I see, thanks for informing!
            </Text>
            <Text className="text-xs text-violet-200 text-right mt-1.5">
              14:28
            </Text>
          </View>
        </View>

        {/* Bot Message */}
        <View className="flex-row mb-4">
          <View className="bg-gray-100 rounded-2xl rounded-tl-none p-4 max-w-[85%]">
            <Text className="text-gray-800 text-base">
              Thanks for contacting me!
            </Text>
            <Text className="text-xs text-gray-400 text-right mt-1.5">
              14:30
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Input Area */}
      <View className="px-4 py-3 border-t border-gray-100">
        <View className="flex-row items-center bg-gray-50 rounded-full px-4 py-2.5 gap-x-3">
          <TouchableOpacity className="p-1.5 rounded-full hover:bg-gray-100">
            <Ionicons name="add" size={24} color="#6d28d9" />
          </TouchableOpacity>
          <TextInput
            placeholder="Nhập tin nhắn..."
            className="flex-1 text-base text-gray-700"
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity className="p-2 rounded-full bg-violet-600 active:bg-violet-700">
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Complaint;
