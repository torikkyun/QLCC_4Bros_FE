import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";

export default function BottomTabsAdmin() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      label: "Home",
      icon: <Ionicons name="home-outline" size={24} />,
      path: "/(admin)/home-admin",
    },
    {
      label: "Người dùng",
      icon: <Feather name="users" size={24} />,
      path: "/userList",
    },
    {
      label: "",
      icon: <MaterialIcons name="add" size={30} />,
      path: "/CreateNotificationScreen",
      isPlusButton: true,
    },
    {
      label: "Phòng",
      icon: <Ionicons name="bed-outline" size={24} />,
      path: "/RoomList",
    },
    {
      label: "Hồ Sơ",
      icon: <Feather name="user" size={24} />,
      path: "/profile",
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(({ label, icon, path, isPlusButton }) => {
        const isActive = pathname === path;
        return (
          <TouchableOpacity
            key={label || "plus-button"}
            onPress={() => router.push(path as any)}
            style={[
              styles.tabItem,
              isPlusButton && styles.plusButton,
            ]}
          >
            {React.cloneElement(icon, {
              color: isPlusButton
                ? "#fff"
                : isActive
                ? "#6D28D9"
                : "#9CA3AF",
            })}
            {!isPlusButton && (
              <Text
                style={[
                  styles.tabText,
                  isActive && { color: "#6D28D9" },
                ]}
              >
                {label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  plusButton: {
    backgroundColor: "#6B7280",
    borderRadius: 999,
    width: 48,
    height: 48,
    marginTop: -24,
    alignItems: "center",
    justifyContent: "center",
  },
});
