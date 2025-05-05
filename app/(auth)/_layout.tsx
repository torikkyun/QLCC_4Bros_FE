import { Stack } from "expo-router";
import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { roomService } from "@/api/services/room.service";

export default function AuthLayout() {
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        // Thêm logic kiểm tra token có hợp lệ không ở đây
        // Ví dụ: gọi API để validate token
        const rooms = await roomService.getRooms({
          page: 1,
          limit: 1,
        });
        console.log(rooms);
        router.replace("/(user)/HomeUser");
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error);
      await AsyncStorage.removeItem("userToken");
    }
  };

  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "fade" }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" options={{ title: "Đăng nhập" }} />
      <Stack.Screen name="SignUp" options={{ title: "Đăng ký" }} />
    </Stack>
  );
}
