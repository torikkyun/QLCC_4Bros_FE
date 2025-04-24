import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomTabs from "../../components/BottomTabs";

export default function PaymentScreen() {
  return (
    <View className="flex-1 bg-white">
      {/* Nội dung chính */}
      <View className="flex-1 px-4 pt-4 pb-2 justify-between">
        {/* Top Content */}
        <View>
          {/* Header */}
          <View className="flex-row items-center mb-10">
            <Ionicons name="chevron-back" size={24} />
            <Text className="text-lg font-bold ml-2">Advance Payment</Text>
          </View>

          {/* Nội dung */}
          <View className="gap-8">
            {/* Room & Charges */}
            <View
              className="bg-gray-100 rounded-2xl p-5 flex-row justify-between items-start"
              style={{ minHeight: 180 }}
            >
              {/* Room number */}
              <View
                className="bg-white rounded-lg items-center justify-center"
                style={{
                  width: 100,
                  aspectRatio: 1,
                }}
              >
                <Text className="text-gray-400 text-sm">Room</Text>
                <Text className="text-4xl font-bold text-gray-800">404</Text>
              </View>

              {/* Charges */}
              <View className="flex-1 ml-4">
                <Text className="text-gray-900 font-semibold mb-2">
                  Chi Phí Tháng Này:
                </Text>
                <Text className="text-base text-gray-600 border-b border-gray-300 py-1">
                  Điện:....
                </Text>
                <Text className="text-base text-gray-600 border-b border-gray-300 py-1">
                  Nước:....
                </Text>
                <Text className="text-base text-gray-600 py-1">Khác:....</Text>
              </View>
            </View>

            {/* Price Details */}
            <View
              className="bg-white shadow-md rounded-2xl p-5 justify-between"
              style={{ minHeight: 140 }}
            >
              <View className="flex-row justify-between mb-3">
                <Text className="font-semibold text-gray-900 text-base">
                  Price details
                </Text>
                <TouchableOpacity>
                  <Text className="text-purple-500 text-sm font-semibold">
                    More info
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 text-base">Total price</Text>
                <Text className="text-purple-600 font-bold text-lg">$500</Text>
              </View>
            </View>

            {/* Pay with */}
            <View
              className="bg-white shadow-md rounded-2xl p-5 justify-center"
              style={{ minHeight: 220 }}
            >
              <Text className="font-semibold text-gray-900 text-base mb-5">
                Pay with
              </Text>

              {[
                {
                  label: "Debit card",
                  desc: "Accepting Visa, Mastercard, etc",
                },
                { label: "Google Pay" },
                { label: "Apple Pay" },
                { label: "PayPal" },
              ].map((method, index) => (
                <View
                  key={index}
                  className="flex-row justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
                >
                  <View>
                    <Text className="text-gray-800 font-medium">
                      {method.label}
                    </Text>
                    {method.desc && (
                      <Text className="text-xs text-gray-400">
                        {method.desc}
                      </Text>
                    )}
                  </View>
                  <Ionicons name="add-circle-outline" size={22} color="#999" />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Nút Thanh Toán */}
        <TouchableOpacity className="bg-purple-600 py-4 rounded-full mt-2">
          <Text className="text-white text-center font-semibold text-base">
            Thanh Toán
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Tabs */}
      <View className="pb-2">
        <BottomTabs />
      </View>
    </View>
  );
}
