import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { useRouter } from "expo-router";
import BottomTabs from "../../components/BottomTabs";

const mockNotifications = [
  {
    id: 1,
    date: "06/09/2025",
    messages: [
      "Phát hiện rò rỉ bồn chứa nước ở tầng thượng...",
      "Thang máy tòa nhà có hiện tượng rung lắc nhẹ...",
      "Khu vực đỗ xe đang trong quá quá trình dọn dẹp...",
      "Hệ thống cấp nước sẽ tạm ngừng từ 7h...",
    ],
  },
  {
    id: 2,
    date: "05/09/2025",
    messages: [
      "Hệ thống cấp nước sẽ tạm ngừng từ 7h...",
      "Thang máy tòa nhà có hiện tượng rung lắc nhẹ...",
      "Khu vực đỗ xe đang trong quá quá trình dọn dẹp...",
    ],
  },
];

export default function Notifications() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50 pt-14 px-4">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full bg-gray-100"
        >
          <ArrowLeftIcon size={20} color="#4b5563" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-3 text-gray-800">
          Thông báo chung
        </Text>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {mockNotifications.map((group, index) => (
          <View key={index} className="mb-6">
            <View className="bg-gray-100 px-4 py-2 rounded-md mb-3">
              <Text className="text-sm font-medium text-gray-700">
                Thông báo: {group.date}
              </Text>
            </View>

            <View className="bg-white rounded-xl shadow shadow-gray-200 overflow-hidden">
              {group.messages.map((msg, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() =>
                    router.push({
                      pathname: "/user/notifications-detail",
                      params: {
                        date: group.date,
                        content: msg,
                      },
                    })
                  }
                  className={`px-5 py-3 ${
                    i !== group.messages.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <Text className="text-gray-600">{msg}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <View className="mb-6" />
      </ScrollView>

      <BottomTabs />
    </View>
  );
}
