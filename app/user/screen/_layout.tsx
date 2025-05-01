import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="home-user" options={{ title: "Trang chủ" }} />
      <Stack.Screen
        name="payment-success"
        options={{ title: "Thanh toán thành công" }}
      />
      <Stack.Screen name="payment" options={{ title: "Thanh toán" }} />
      <Stack.Screen
        name="payment-history"
        options={{ title: "Lịch sử thanh toán" }}
      />
      <Stack.Screen
        name="notifications"
        options={{ title: "Thông báo chung" }}
      />
      <Stack.Screen
        name="notifications-detail"
        options={{ title: "Thông báo chi tiết" }}
      />
    </Stack>
  );
}
