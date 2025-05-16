import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios, { AxiosError } from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const PersonalDetail: React.FC = () => {
  const [user, setUser] = useState<User>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [emailDisplay, setEmailDisplay] = useState<string>("No email");
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken");
        if (!userToken) {
          Alert.alert("Thông báo", "Vui lòng đăng nhập để tiếp tục.");
          router.replace("/(auth)/Login");
          return;
        }

        const meResponse = await axios.get(
          "http://103.167.89.178:3000/api/user/me",
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const userId = meResponse.data.id;

        const userResponse = await axios.get(
          `http://103.167.89.178:3000/api/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const data = userResponse.data;
        setUser({
          id: data.id || 0,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          password: "",
        });
        setEmailDisplay(data.email);
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          Alert.alert(
            "Lỗi",
            "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
          );
          await AsyncStorage.removeItem("userToken");
          router.replace("/(auth)/Login");
        } else {
          Alert.alert("Lỗi", "Không thể lấy thông tin người dùng.");
        }
      }
    };
    fetchUserData();
  }, [router]);

  const handleChange = (name: keyof User, value: string) => {
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
  };

  const handleSave = async () => {
    if (user.password && user.password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp!");
      return;
    }

    if (user.password && user.password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (!userToken) {
        Alert.alert("Thông báo", "Vui lòng đăng nhập để tiếp tục.");
        router.replace("/(auth)/Login");
        return;
      }

      const updateData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        ...(user.password && { password: user.password }),
      };

      await axios.patch("http://103.167.89.178:3000/api/user", updateData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setEmailDisplay(user.email);
      Alert.alert("Thành công", "Cập nhật hồ sơ thành công!");
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        Alert.alert("Lỗi", "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        await AsyncStorage.removeItem("userToken");
        router.replace("/(auth)/Login");
      } else {
        Alert.alert("Lỗi", "Không thể cập nhật hồ sơ!");
      }
    }
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 p-4 justify-center">
      <View className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto">
        <Text className="text-3xl font-semibold text-[#1a3c5e] mb-6 text-center">
          Thông tin cá nhân
        </Text>
        <View className="items-center mb-6">
          <Image
            source={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV0uIwYXnx-rJPETwTazZA9DowQcWcpzTZHQ&s", // URL ảnh cố định
            }}
            className="w-28 h-28 rounded-full border-2 border-gradient-to-r from-violet-500 to-violet-700 shadow-md"
          />
        </View>
        <Text className="text-sm text-gray-500 mb-6 text-center">
          {emailDisplay}
        </Text>
        <TextInput
          value={user.firstName}
          onChangeText={(text) => handleChange("firstName", text)}
          placeholder="Tên"
          className="w-full p-3 mb-4 border border-gray-200 rounded-xl text-gray-800"
          placeholderTextColor="#9CA3AF"
        />
        <TextInput
          value={user.lastName}
          onChangeText={(text) => handleChange("lastName", text)}
          placeholder="Họ"
          className="w-full p-3 mb-4 border border-gray-200 rounded-xl text-gray-800"
          placeholderTextColor="#9CA3AF"
        />
        <TextInput
          value={user.email}
          onChangeText={(text) => handleChange("email", text)}
          placeholder="youremail@shtha.com"
          className="w-full p-3 mb-4 border border-gray-200 rounded-xl text-gray-800"
          keyboardType="email-address"
          placeholderTextColor="#9CA3AF"
        />
        <TextInput
          value={user.password}
          onChangeText={(text) => handleChange("password", text)}
          placeholder="Mật khẩu mới"
          className="w-full p-3 mb-4 border border-gray-200 rounded-xl text-gray-800"
          secureTextEntry
          placeholderTextColor="#9CA3AF"
        />
        <TextInput
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          placeholder="Xác nhận mật khẩu mới"
          className="w-full p-3 mb-4 border border-gray-200 rounded-xl text-gray-800"
          secureTextEntry
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity
          onPress={handleSave}
          className="w-full bg-gradient-to-r from-violet-500 to-violet-700 p-4 rounded-xl"
        >
          <Text className="text-white text-center font-semibold">Cập nhật</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PersonalDetail;
