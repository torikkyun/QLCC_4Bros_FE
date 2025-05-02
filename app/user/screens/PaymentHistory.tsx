import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { useRouter } from "expo-router";
import BottomTabs from "@/app/components/BottomTabs";

export default function PaymentHistory() {
  const router = useRouter();

  const mockData = [
    {
      date: "06/09/2025",
      items: {
        Điện: "$123",
        Nước: "$45",
        Khác: "$10",
      },
      total: "$178",
    },
    {
      date: "01/01/2026",
      items: {
        Điện: "$95",
        Nước: "$38",
        Khác: "$12",
      },
      total: "$145",
    },
  ];

  return (
    <View className="flex-1 bg-gray-50 pt-14 px-4">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full bg-gray-100"
        >
          <ArrowLeftIcon size={20} color="#4b5563" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-3 text-gray-800">
          Lịch sử thanh toán
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
        {mockData.map((entry, index) => (
          <View key={index} className="mb-5">
            <View className="bg-gray-100 px-4 py-2 rounded-md mb-3 w-fit">
              <Text className="text-gray-700 font-medium text-sm">
                Ngày: {entry.date}
              </Text>
            </View>
            <View className="bg-white rounded-xl shadow-sm shadow-gray-300 overflow-hidden">
              {Object.entries(entry.items).map(([label, amount], i) => (
                <View
                  key={i}
                  className={`flex-row justify-between px-5 py-3 ${
                    i !== Object.keys(entry.items).length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <Text className="text-gray-600 font-medium">{label}</Text>
                  <Text className="text-gray-700">{amount}</Text>
                </View>
              ))}

              <View className="flex-row justify-between px-5 py-3 bg-gray-50">
                <Text className="font-bold text-gray-800">Tổng cộng</Text>
                <Text className="font-bold text-blue-600">{entry.total}</Text>
              </View>
            </View>
          </View>
        ))}
        <View className="mb-5" />
      </ScrollView>
      <BottomTabs />
    </View>
  );
}
