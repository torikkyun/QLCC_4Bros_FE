import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="RoomList" options={{ title: "Danh sách phòng" }} />
    </Stack>
  );
}
