import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="HomeUser" options={{ title: "Trang chủ" }} />
      <Stack.Screen
        name="PaymentSuccess"
        options={{ title: "Thanh toán thành công" }}
      />
      <Stack.Screen name="payment" options={{ title: "Thanh toán" }} />
      <Stack.Screen
        name="PaymentHistory"
        options={{ title: "Lịch sử thanh toán" }}
      />
      <Stack.Screen
        name="Notifications"
        options={{ title: "Thông báo chung" }}
      />
      <Stack.Screen
        name="NotificationsDetail"
        options={{ title: "Thông báo chi tiết" }}
      />
    </Stack>
  );
}
