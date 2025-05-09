import { Stack } from "expo-router";
import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { candidatesService } from "@/api/services/candidates.service";

export default function AuthLayout() {
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        const candidates = await candidatesService.getCandidates({
          page: 1,
          limit: 1,
        });
        // const candidates = {
        //   statusCode: 401,
        //   message: "Unauthorized",
        // };
        if (candidates.statusCode == 401) {
          await AsyncStorage.removeItem("userToken");
          router.replace("./Login");
          return;
        }
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
