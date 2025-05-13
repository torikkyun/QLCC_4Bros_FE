import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import axios, { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
  const [avatar, setAvatar] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [emailDisplay, setEmailDisplay] = useState<string>("No email");
  const router = useRouter();

  // Load initial data (avatar, email) from AsyncStorage
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedAvatar = await AsyncStorage.getItem("avatar");
        const storedEmail = await AsyncStorage.getItem("email");
        if (storedAvatar) setAvatar(storedAvatar);
        if (storedEmail) setEmailDisplay(storedEmail);
      } catch (error) {
        console.error("Error loading from AsyncStorage:", error);
      }
    };
    loadStoredData();
  }, []);

  // Fetch user data: Get ID from /user/me, then fetch details from /user/{id}
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken");
        console.log("userToken:", userToken); // Debug token
        if (!userToken) {
          Alert.alert("Thông báo", "Vui lòng đăng nhập để tiếp tục.");
          router.replace("/(auth)/Login");
          return;
        }

        // Step 1: Get user ID from /user/me
        const meResponse = await axios.get(
          "http://103.167.89.178:3000/api/user/me",
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        console.log("API /user/me response:", meResponse.data); // Debug
        const userId = meResponse.data.id;

        if (!userId) {
          throw new Error("User ID not found in /user/me response");
        }

        // Step 2: Fetch user details from /user/{id}
        const userResponse = await axios.get(
          `http://103.167.89.178:3000/api/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        console.log("API /user/{id} response:", userResponse.data); // Debug
        const data = userResponse.data;
        setUser({
          id: data.id || 0,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          password: "", // Password not populated for security
        });
        await AsyncStorage.setItem("email", data.email);
        setEmailDisplay(data.email);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error(
          "Error fetching user data:",
          axiosError.response?.data || axiosError.message
        );
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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Lỗi", "Cần quyền truy cập thư viện ảnh để chọn avatar.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0].base64) {
      const imageData = `data:image/jpeg;base64,${result.assets[0].base64}`;
      try {
        await AsyncStorage.setItem("avatar", imageData);
        setAvatar(imageData);
      } catch (error) {
        console.error("Error saving avatar:", error);
        Alert.alert("Lỗi", "Không thể lưu ảnh.");
      }
    }
  };

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
      console.log("userToken for update:", userToken); // Debug token
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
      console.log("Data sent to API:", updateData); // Debug dữ liệu gửi

      const response = await axios.patch(
        "http://103.167.89.178:3000/api/user",
        updateData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log("API /user update response:", response.data); // Debug phản hồi từ API

      await AsyncStorage.setItem("email", user.email);
      setEmailDisplay(user.email);
      Alert.alert("Thành công", "Cập nhật hồ sơ thành công!");
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        "Error updating user:",
        axiosError.response?.data || axiosError.message
      );
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
        <TouchableOpacity
          onPress={pickImage}
          activeOpacity={0.7}
          className="items-center mb-6"
        >
          <Image
            source={{ uri: avatar || "https://via.placeholder.com/100" }}
            className="w-28 h-28 rounded-full border-2 border-gradient-to-r from-violet-500 to-violet-700 shadow-md"
          />
          <Ionicons
            name="camera"
            size={20}
            color="#6D28D9"
            className="absolute bottom-2 right-2 bg-white rounded-full p-1"
          />
        </TouchableOpacity>
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
          className="w-full bg-violet-500 p-3 rounded-xl shadow-md mt-4"
        >
          <Text className="text-white text-center text-lg font-medium">
            Lưu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/(auth)/Login")}>
          <Text className="mt-4 text-center text-[#6D28D9] text-sm font-medium underline">
            Quay lại đăng nhập
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PersonalDetail;
