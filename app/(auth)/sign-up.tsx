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
import { Eye, EyeOff } from "lucide-react-native";

export default function SignUpScreen() {
  const { form, errors, isLoading, serverError, handleChange, handleSubmit } =
    useSignUp();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white px-8 pt-40 pb-20"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Title */}
      <Text className="text-4xl font-bold text-blue-900 text-center mb-1">
        Đăng ký
      </Text>
      <Text className="text-lg text-gray-500 text-center mb-6">
        Vui lòng điền thông tin
      </Text>

      {/* Server Error */}
      {serverError && (
        <Text className="text-red-500 text-center mb-4 text-sm">
          {serverError}
        </Text>
      )}

      {/* Firstname & Lastname */}
      <View className="flex-row mb-2 justify-between">
        <View style={{ width: "49%" }}>
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
        <View style={{ width: "49%" }}>
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

      {/* Confirm Password */}
      <View className="mb-4 relative">
        <TextInput
          className={`bg-gray-100 px-4 py-3 rounded-md text-base mb-1 ${
            errors.confirmPassword ? "border border-red-500" : ""
          }`}
          placeholder="Nhập lại mật khẩu"
          placeholderTextColor="#999"
          secureTextEntry={!showConfirmPassword} // Sử dụng state riêng cho confirm password
          value={form.confirmPassword}
          onChangeText={(text) => handleChange("confirmPassword", text)}
        />
        <TouchableOpacity
          onPress={toggleShowConfirmPassword}
          className="absolute right-3 top-3"
        >
          {showConfirmPassword ? (
            <Eye color="#666" size={20} />
          ) : (
            <EyeOff color="#666" size={20} />
          )}
        </TouchableOpacity>
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
      <TouchableOpacity
        className="items-center"
        onPress={() => router.replace("../login")}
      >
        <Text className="text-center text-sm text-gray-600 underline">
          Đã có tài khoản? Đăng nhập
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
