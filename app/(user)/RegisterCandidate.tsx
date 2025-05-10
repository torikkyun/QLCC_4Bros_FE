import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomTabs from "@/components/BottomTabs";
import { router } from "expo-router";
import { useRegisterCandidate } from "@/hooks/useRegisterCandidate";
import { candidatesService } from "@/api/services/candidates.service";

const RegisterScreen = () => {
  const { fullName, loading, error } = useRegisterCandidate();
  const [description, setDescription] = useState<string>("");
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  const handleSubmit = async () => {
    // Reset error message
    setFormError("");

    // Kiểm tra điều kiện
    if (!fullName) {
      setFormError("Vui lòng chờ hệ thống lấy thông tin của bạn");
      return;
    }

    if (description.trim().length < 5) {
      setFormError("Mô tả phải có ít nhất 5 ký tự");
      return;
    }

    if (!isAgreed) {
      setFormError("Vui lòng đồng ý với điều khoản và điều kiện");
      return;
    }
    try {
      await candidatesService.createCandidate({
        description: description.trim(),
      });

      Alert.alert("Thành công", "Đăng ký ứng cử viên thành công!", [
        {
          text: "OK",
          onPress: () => router.replace("/(user)/HomeUser"),
        },
      ]);
    } catch (error: any) {
      if (error.response?.status === 409) {
        setFormError("Bạn đã đăng ký ứng cử viên rồi");
        return;
      }

      if (error.response?.data?.message) {
        setFormError(
          Array.isArray(error.response.data.message)
            ? error.response.data.message[0]
            : error.response.data.message
        );
        return;
      }

      setFormError("Có lỗi xảy ra khi đăng ký ứng cử viên");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-2">Đăng ký</Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Form Input */}
        <View className="mt-4">
          <Text className="text-gray-700 text-base mb-2">Họ tên</Text>
          <TextInput
            className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-400"
            placeholder="Nhập họ tên của bạn"
            value={fullName}
            editable={false}
          />
          {loading && (
            <Text className="text-gray-500 text-sm mt-1">
              Đang tải thông tin...
            </Text>
          )}
          {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
        </View>

        <View className="mt-4">
          <Text className="text-gray-700 text-base mb-2">Mô tả</Text>
          <TextInput
            className="w-full bg-gray-100 rounded-lg px-4 py-3 h-32"
            placeholder="Nhập mô tả (tối thiểu 5 ký tự)"
            multiline={true}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Upload Button */}
        {/* <TouchableOpacity className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-4 items-center">
          <View className="items-center">
            <Ionicons name="cloud-upload-outline" size={32} color="gray" />
            <Text className="text-gray-500 mt-2">Upload Property Pictures</Text>
          </View>
        </TouchableOpacity> */}

        {/* Terms and Conditions */}
        <View className="flex-row items-center mt-6">
          <TouchableOpacity
            className={`w-5 h-5 border ${
              isAgreed ? "bg-emerald-500 border-emerald-500" : "border-gray-300"
            } rounded mr-2`}
            onPress={() => setIsAgreed(!isAgreed)}
          >
            {isAgreed && <Ionicons name="checkmark" size={16} color="white" />}
          </TouchableOpacity>
          <Text className="text-gray-600 flex-1">
            Tôi đồng ý với các điều khoản và điều kiện của 4Bros
          </Text>
        </View>

        {/* Error message */}
        {formError && (
          <Text className="text-red-500 mt-4 text-center">{formError}</Text>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          className={`rounded-lg py-4 items-center mt-6 mb-8 ${
            isAgreed && description.trim() && fullName
              ? "bg-emerald-500"
              : "bg-gray-300"
          }`}
          onPress={handleSubmit}
          disabled={!isAgreed || !description.trim() || !fullName}
        >
          <Text className="text-white font-semibold text-lg">GỬI</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomTabs />
    </SafeAreaView>
  );
};

export default RegisterScreen;
