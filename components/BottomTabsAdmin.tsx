import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";

export default function BottomTabsAdmin() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      label: "TenantList",
      icon: <Ionicons name="home-outline" size={24} />,
      path: "/(admin)/TenantListScreen",
    },
    {
      label: "User List",
      icon: <Feather name="users" size={24} />,
      path: "/user/user-list",
    },
    {
      label: "", // No label for the "+" button
      icon: <MaterialIcons name="add" size={30} />, // Using MaterialIcons for the "+"
      path: "/add", // Adjust the path as needed
      isPlusButton: true, // Custom property to identify the "+" button
    },
    {
      label: "Room List",
      icon: <Ionicons name="bed-outline" size={24} />, // Using bed-outline as a placeholder for "Room List"
      path: "/user/room-list",
    },
    {
      label: "Profile",
      icon: <Feather name="user" size={24} />,
      path: "/profile",
    },
  ];

  return (
    <View className="flex-row justify-around bg-white py-3 border-t border-gray-200">
      {tabs.map(({ label, icon, path, isPlusButton }) => {
        const isActive = pathname === path;
        return (
          <TouchableOpacity
            key={label || "plus-button"} // Use a unique key for the "+" button
            onPress={() => router.push(path as any)}
            className={clsx(
              "items-center justify-center",
              isPlusButton && "bg-gray-200 rounded-full w-12 h-12 -mt-6" // Styling for the "+" button
            )}
          >
            {React.cloneElement(icon, {
              color: isPlusButton ? "#fff" : isActive ? "#6D28D9" : "#9CA3AF", // White for the "+" button
            })}
            {!isPlusButton && ( // Hide label for the "+" button
              <Text
                className={clsx(
                  "text-xs mt-1", // Added margin-top for spacing
                  isActive ? "text-violet-700" : "text-gray-400"
                )}
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
