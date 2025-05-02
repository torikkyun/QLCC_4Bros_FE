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
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity>
          <Text className="text-2xl">&lt;</Text>
        </TouchableOpacity>
        <View className="flex-row items-center ml-4">
          <Image
            source={require("@/assets/images/fubuki.jpg")}
            className="max-w-8 max-h-8 rounded-full"
          />
          <Text className="ml-2 text-lg font-semibold">4B Bot</Text>
        </View>
        <TouchableOpacity className="ml-auto">
          <Text className="text-2xl">≡</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <ScrollView className="flex-1 p-4">
        {/* User Message */}
        <View className="flex-row justify-end mb-4">
          <View className="bg-violet-500 rounded-2xl p-3 max-w-[80%]">
            <Text className="text-white">How is the property condition?</Text>
            <Text className="text-xs text-gray-200 text-right mt-1">14:22</Text>
          </View>
        </View>

        {/* Bot Message */}
        <View className="flex-row mb-4">
          <View className="bg-gray-100 rounded-2xl p-3 max-w-[80%]">
            <Text className="text-gray-800">
              It's nice myan for sure.{"\n"}You will love it
            </Text>
            <Text className="text-xs text-gray-500 text-right mt-1">14:24</Text>
          </View>
        </View>

        {/* User Message */}
        <View className="flex-row justify-end mb-4">
          <View className="bg-violet-500 rounded-2xl p-3 max-w-[80%]">
            <Text className="text-white">I see, thanks for informing!</Text>
            <Text className="text-xs text-gray-200 text-right mt-1">14:28</Text>
          </View>
        </View>

        {/* Bot Message */}
        <View className="flex-row mb-4">
          <View className="bg-gray-100 rounded-2xl p-3 max-w-[80%]">
            <Text className="text-gray-800">Thanks for contacting me!</Text>
            <Text className="text-xs text-gray-500 text-right mt-1">14:30</Text>
          </View>
        </View>
      </ScrollView>

      {/* Input Area */}
      <View className="p-4 border-t border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <TouchableOpacity>
            <Text className="text-2xl text-gray-400">+</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Type something"
            className="flex-1 ml-2"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity>
            <Image
              source={require("@/assets/images/fubuki.jpg")}
              className="max-w-7 max-h-7 rounded-full"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Complaint;
