import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, animation: "fade" }}>
      <Stack.Screen name="CreateNotificationScreen" options={{ title: "Tạo Thông Báo" }} />
      {/* <Stack.Screen name="payment" options={{ title: "Thanh toán" }} />
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
      /> */}
    </Stack>
  );
}
