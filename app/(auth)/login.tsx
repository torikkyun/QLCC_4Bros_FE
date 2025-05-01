import React from "react";
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
    <View className="flex-1 bg-white px-6 justify-center">
      {/* Header */}
      <Text className="text-2xl text-blue-900 font-semibold mb-2">4Bros</Text>
      <Text className="text-4xl font-bold text-blue-900 mb-10">Sign in</Text>

      {/* Server Error */}
      {serverError && (
        <Text className="text-red-500 text-center mb-4 text-sm">
          {serverError}
        </Text>
      )}

      {/* Email */}
      <Text className="text-xs text-gray-500 mb-2">YOUR EMAIL</Text>
      <TextInput
        className={`bg-gray-100 rounded-md px-4 py-3 mb-1 text-base ${
          errors.email ? "border border-red-500" : ""
        }`}
        placeholder="yourmail@shrestha.com"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#999"
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
      />
      {errors.email && (
        <Text className="text-red-500 text-xs mb-3">{errors.email}</Text>
      )}

      {/* Password */}
      <Text className="text-xs text-gray-500 mb-2">PASSWORD</Text>
      <View
        className={`flex-row items-center bg-gray-100 rounded-md px-4 py-3 mb-1 ${
          errors.password ? "border border-red-500" : ""
        }`}
      >
        <TextInput
          className="flex-1 text-base"
          placeholder="••••••••••"
          secureTextEntry={!showPassword}
          placeholderTextColor="#999"
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
        />
        <TouchableOpacity onPress={toggleShowPassword}>
          {showPassword ? (
            <Eye className="text-gray-600" size={20} />
          ) : (
            <EyeOff className="text-gray-600" size={20} />
          )}
        </TouchableOpacity>
      </View>
      {errors.password && (
        <Text className="text-red-500 text-xs mb-3">{errors.password}</Text>
      )}

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
            Login
          </Text>
        )}
      </TouchableOpacity>

      {/* Create Account */}
      <Text className="text-center text-sm mb-2">Don't have an account?</Text>
      <TouchableOpacity
        className="bg-black py-3 rounded-md"
        onPress={() => router.push("../sign-up")}
      >
        <Text className="text-white text-center font-semibold">
          Create an Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}
