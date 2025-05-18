import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import clsx from "clsx";

export default function BottomTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      label: "Trang chủ",
      icon: <Ionicons name="home-outline" size={24} />,
      path: "/(user)/HomeUser",
    },
    {
      label: "Lịch sử",
      icon: <Feather name="clock" size={24} />,
      path: "/(user)/PaymentHistory",
    },
    {
      label: "Thông báo",
      icon: <Ionicons name="notifications-outline" size={24} />,
      path: "/(user)/Notifications",
    },
    {
      label: "Cá nhân",
      icon: <Feather name="user" size={24} />,
      path: "(admin)/Profile",
    },
  ];

  return (
    <View className="flex-row justify-around bg-white py-3 border-t border-gray-200">
      {tabs.map(({ label, icon, path }) => {
        const isActive = pathname === path;
        return (
          <TouchableOpacity
            key={label}
            onPress={() => router.push(path as any)}
            className="items-center"
          >
            {React.cloneElement(icon, {
              color: isActive ? "#6D28D9" : "#9CA3AF",
            })}
            <Text
              className={clsx(
                "text-xs",
                isActive ? "text-violet-700" : "text-gray-400"
              )}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
