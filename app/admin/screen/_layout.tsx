import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="home-admin" options={{ title: "Trang chủ" }} />
      <Stack.Screen name="roomDetail" options={{ title: "Thông tin phòng" }} />
      <Stack.Screen name="userList" options={{ title: "Danh sách người dùng"}} />
    </Stack>
  );
}
