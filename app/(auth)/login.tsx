import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { router } from "expo-router";
import { useLogin } from "./login.hook";

export default function LoginScreen() {
  const {
    form,
    errors,
    isLoading,
    serverError,
    showPassword,
    handleChange,
    handleSubmit,
    toggleShowPassword,
  } = useLogin();

  return (
    <View className="flex-1 bg-white px-8 pt-40 pb-20">
      {/* Header */}
      <Text className="text-3xl text-blue-900 font-semibold text-center mb-2">
        4Bros
      </Text>
      <Text className="text-4xl font-bold text-blue-900 text-center mb-10">
        Đăng nhập
      </Text>

      {/* Server Error */}
      {serverError && (
        <Text className="text-red-500 text-center mb-4 text-sm">
          {serverError}
        </Text>
      )}

      {/* Email */}
      <Text className="text-xs text-gray-500 mb-2">Email của bạn</Text>
      <TextInput
        className={`bg-gray-100 px-4 py-3 rounded-md text-base mb-1 ${
          errors.email ? "border border-red-500" : ""
        }`}
        placeholder="yourmail@shrestha.com"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
        underlineColorAndroid="transparent"
      />
      {errors.email && (
        <Text className="text-red-500 text-xs mb-3">{errors.email}</Text>
      )}

      {/* Password */}
      <Text className="text-xs text-gray-500 mb-2">Mật khẩu</Text>
      <View className="mb-1 relative">
        <TextInput
          className={`bg-gray-100 px-4 py-3 rounded-md text-base mb-1 ${
            errors.password ? "border border-red-500" : ""
          }`}
          placeholder="••••••••••"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
          underlineColorAndroid="transparent"
        />
        <TouchableOpacity
          onPress={toggleShowPassword}
          className="absolute right-3 top-3"
        >
          {showPassword ? (
            <Eye color="#666" size={20} />
          ) : (
            <EyeOff color="#666" size={20} />
          )}
        </TouchableOpacity>
        {errors.password && (
          <Text className="text-red-500 text-xs mt-1">{errors.password}</Text>
        )}
      </View>

      {/* Login Button */}
      <TouchableOpacity
        className="bg-blue-600 rounded-md py-4 mb-4 flex-row justify-center items-center"
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold text-base">
            Đăng nhập
          </Text>
        )}
      </TouchableOpacity>

      {/* Create Account */}
      <Text className="text-center text-sm mb-2">Chưa có tài khoản?</Text>
      <TouchableOpacity
        className="bg-black py-3 rounded-md"
        onPress={() => router.push("../sign-up")}
      >
        <Text className="text-white text-center font-semibold">
          Tạo một tài khoản mới
        </Text>
      </TouchableOpacity>
    </View>
  );
}
