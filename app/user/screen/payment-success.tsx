import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeftIcon, Bars3Icon } from "react-native-heroicons/outline";
import BottomTabs from "../../components/BottomTabs";

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white px-4 pt-14">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeftIcon size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black">Payment</Text>
        <TouchableOpacity>
          <Bars3Icon size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Success Box */}
      <View className="items-center justify-center flex-1 -mt-16">
        <View className="bg-white px-6 py-8 rounded-2xl shadow items-center w-full max-w-md">
          {/* Check icon */}
          <View className="bg-emerald-400 w-24 aspect-square rounded-full items-center justify-center mb-6">
            <Text className="text-white text-5xl">✓</Text>
          </View>

          {/* Texts */}
          <Text className="text-xl font-bold text-gray-700 mb-2">Success</Text>
          <Text className="text-gray-400 mb-6 text-center">
            You have completed your payment
          </Text>

          {/* Button */}
          <TouchableOpacity
            onPress={() => router.replace("/")}
            className="bg-emerald-400 w-full py-3 rounded-xl"
          >
            <Text className="text-white font-semibold text-center">
              về trang chủ
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Tabs */}
      <BottomTabs />
    </View>
  );
}
