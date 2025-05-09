import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="RoomList" options={{ title: "Danh sách phòng" }} />
      <Stack.Screen
        name="CreateNotificationScreen"
        options={{ title: "Tạo Thông Báo" }}
      />
      <Stack.Screen
        name="TenantListScreen"
        options={{ title: "Tạo hông Báo" }}
      />
      <Stack.Screen name="notification" options={{ title: "Thông Báo" }} />
    </Stack>
  );
}
