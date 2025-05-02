import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomTabs from "@/app/components/BottomTabs";

const RegisterScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-2">Đăng ký</Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Form Input */}
        <View className="mt-4">
          <Text className="text-gray-700 text-base mb-2">Họ tên</Text>
          <TextInput
            className="w-full bg-gray-100 rounded-lg px-4 py-3"
            placeholder="Nhập họ tên của bạn"
          />
        </View>

        <View className="mt-4">
          <Text className="text-gray-700 text-base mb-2">Description</Text>
          <TextInput
            className="w-full bg-gray-100 rounded-lg px-4 py-3 h-32"
            placeholder="Nhập mô tả"
            multiline={true}
            textAlignVertical="top"
          />
        </View>

        {/* Upload Button */}
        <TouchableOpacity className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-4 items-center">
          <View className="items-center">
            <Ionicons name="cloud-upload-outline" size={32} color="gray" />
            <Text className="text-gray-500 mt-2">Upload Property Pictures</Text>
          </View>
        </TouchableOpacity>

        {/* Terms and Conditions */}
        <View className="flex-row items-center mt-6">
          <TouchableOpacity className="w-5 h-5 border border-gray-300 rounded mr-2" />
          <Text className="text-gray-600 flex-1">
            I agree to the terms and condition of Bimal
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity className="bg-emerald-500 rounded-lg py-4 items-center mt-6 mb-8">
          <Text className="text-white font-semibold text-lg">SUBMIT</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomTabs />
    </SafeAreaView>
  );
};

export default RegisterScreen;
