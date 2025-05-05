import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import BottomTabs from "@/components/BottomTabs";

export default function NotificationDetail() {
  const router = useRouter();
  const { date, content } = useLocalSearchParams();

  // Tự bịa thêm chi tiết dựa trên nội dung
  const detailedContentMap: Record<string, string> = {
    "Phát hiện rò rỉ bồn chứa nước ở tầng thượng...":
      "Phát hiện rò rỉ bồn chứa nước ở tầng thượng. Ban quản lý đang tiến hành sửa chữa và khắc phục. Vui lòng tiết kiệm nước trong thời gian này.",
    "Thang máy tòa nhà có hiện tượng rung lắc nhẹ...":
      "Thang máy tòa nhà có hiện tượng rung lắc nhẹ. Đội kỹ thuật đang kiểm tra để đảm bảo an toàn cho cư dân. Tạm thời ưu tiên dùng thang bộ.",
    "Khu vực đỗ xe đang trong quá quá trình dọn dẹp...":
      "Khu vực đỗ xe đang trong quá trình dọn dẹp. Một số chỗ sẽ bị hạn chế tạm thời. Mong cư dân tuân thủ hướng dẫn của bảo vệ.",
    "Hệ thống cấp nước sẽ tạm ngừng từ 7h...":
      "Hệ thống cấp nước sẽ tạm ngừng từ 7h sáng đến 11h trưa thứ Hai để bảo trì. Rất mong cư dân thông cảm và chuẩn bị trước nước sinh hoạt.",
  };

  const fullContent =
    detailedContentMap[content as string] || "Nội dung thông báo chi tiết...";

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

      {/* Body scrollable */}
      <ScrollView showsVerticalScrollIndicator={false} className="mb-6">
        {/* Thời gian thông báo */}
        <View className="bg-gray-100 px-4 py-2 rounded-md mb-3">
          <Text className="text-sm font-medium text-gray-700">
            Thông báo: {date}
          </Text>
        </View>

        {/* Nội dung chi tiết */}
        <View className="bg-white rounded-xl shadow shadow-gray-200 p-5">
          <Text className="text-gray-800 text-base leading-6">
            {fullContent}
          </Text>
        </View>
      </ScrollView>

      {/* Tabs luôn ở cuối */}
      <BottomTabs />
    </View>
  );
}
