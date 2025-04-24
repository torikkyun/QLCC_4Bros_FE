import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignUp } from "./sign-up.hook";

export default function SignUpScreen() {
  const { form, errors, isLoading, serverError, handleChange, handleSubmit } =
    useSignUp();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white px-6 pt-20"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View className="items-center mb-10">
        <Text className="text-lg text-blue-900 font-semibold">Chúc mừng</Text>
        <Text className="text-sm text-gray-500 mt-1 text-center">
          Bạn đã xác thực email thành công
        </Text>
      </View>

      {/* Title */}
      <Text className="text-3xl font-bold text-blue-900 text-center mb-1">
        Đăng ký
      </Text>
      <Text className="text-sm text-gray-500 text-center mb-6">
        Vui lòng điền thông tin bổ sung
      </Text>

      {/* Server Error */}
      {serverError && (
        <Text className="text-red-500 text-center mb-4 text-sm">
          {serverError}
        </Text>
      )}

      {/* Firstname & Lastname */}
      <View className="flex-row mb-1">
        <View className="w-1/2 mr-1">
          <TextInput
            className={`bg-gray-100 px-4 py-3 rounded-md text-base ${
              errors.firstName ? "border border-red-500" : ""
            }`}
            placeholder="Họ"
            placeholderTextColor="#999"
            value={form.firstName}
            onChangeText={(text) => handleChange("firstName", text)}
          />
          {errors.firstName && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.firstName}
            </Text>
          )}
        </View>
        <View className="w-1/2 ml-1">
          <TextInput
            className={`bg-gray-100 px-4 py-3 rounded-md text-base ${
              errors.lastName ? "border border-red-500" : ""
            }`}
            placeholder="Tên"
            placeholderTextColor="#999"
            value={form.lastName}
            onChangeText={(text) => handleChange("lastName", text)}
          />
          {errors.lastName && (
            <Text className="text-red-500 text-xs mt-1">{errors.lastName}</Text>
          )}
        </View>
      </View>

      {/* Email */}
      <View className="mb-1">
        <TextInput
          className={`bg-gray-100 px-4 py-3 rounded-md text-base mb-1 ${
            errors.email ? "border border-red-500" : ""
          }`}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
        />
        {errors.email && (
          <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
        )}
      </View>

      {/* Password */}
      <View className="mb-1">
        <TextInput
          className={`bg-gray-100 px-4 py-3 rounded-md text-base mb-1 ${
            errors.password ? "border border-red-500" : ""
          }`}
          placeholder="Mật khẩu"
          placeholderTextColor="#999"
          secureTextEntry
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
        />
        {errors.password && (
          <Text className="text-red-500 text-xs mt-1">{errors.password}</Text>
        )}
      </View>

      {/* Confirm Password */}
      <View className="mb-4">
        <TextInput
          className={`bg-gray-100 px-4 py-3 rounded-md text-base mb-1 ${
            errors.confirmPassword ? "border border-red-500" : ""
          }`}
          placeholder="Nhập lại mật khẩu"
          placeholderTextColor="#999"
          secureTextEntry
          value={form.confirmPassword}
          onChangeText={(text) => handleChange("confirmPassword", text)}
        />
        {errors.confirmPassword && (
          <Text className="text-red-500 text-xs mt-1">
            {errors.confirmPassword}
          </Text>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        className="bg-blue-600 py-4 rounded-md mb-6 flex-row justify-center items-center"
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold text-base">
            Đăng ký
          </Text>
        )}
      </TouchableOpacity>

      {/* Login Link */}
      <TouchableOpacity className="items-center">
        <Text className="text-center text-sm text-gray-600 underline">
          Đã có tài khoản? Đăng nhập
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
