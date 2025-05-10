import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomTabs from "@/components/BottomTabs";
import { router } from "expo-router";
import { useRooms } from "@/hooks/useRooms";

const RoomScreen = () => {
  const {
    rooms: filteredRooms,
    loading,
    searchQuery,
    setSearchQuery,
    buttonColor,
    handleStatusFilter,
    getStatusText,
    selectedBlock,
    setSelectedBlock,
    selectedFloor,
    setSelectedFloor,
    getAvailableBlocks,
    getAvailableFloors,
  } = useRooms();
  const [showFilterModal, setShowFilterModal] = useState(false);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4 bg-white shadow-sm">
        <TouchableOpacity
          className="p-2 rounded-full hover:bg-gray-100"
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#1a2b47" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#1a2b47]">4Bros</Text>
        <TouchableOpacity className="p-2 rounded-full hover:bg-gray-100">
          <Ionicons name="menu" size={24} color="#1a2b47" />
        </TouchableOpacity>
      </View>

      {/* Tiêu đề */}
      <Text className="text-3xl font-bold px-6 py-4 text-[#1a2b47]">
        Danh sách phòng
      </Text>

      {/* Thanh tìm kiếm */}
      <View className="mx-6 mb-6">
        <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
          <Ionicons name="search" size={20} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-3 text-base text-gray-700"
            placeholder="Tìm kiếm phòng theo số"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
          <TouchableOpacity
            onPress={() => setShowFilterModal(true)}
            className="p-2"
          >
            <Ionicons name="filter" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Modal lọc */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showFilterModal}
          onRequestClose={() => setShowFilterModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl p-6">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-bold text-[#1a2b47]">Bộ lọc</Text>
                <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                  <Ionicons name="close" size={24} color="#1a2b47" />
                </TouchableOpacity>
              </View>

              {/* Lọc theo dãy */}
              <Text className="text-gray-700 mb-2 font-medium">Dãy</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4"
              >
                <TouchableOpacity
                  onPress={() => setSelectedBlock("")}
                  className={`mr-2 px-4 py-2 rounded-lg ${
                    selectedBlock === ""
                      ? "bg-blue-500"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <Text
                    className={
                      selectedBlock === "" ? "text-white" : "text-gray-700"
                    }
                  >
                    Tất cả
                  </Text>
                </TouchableOpacity>
                {getAvailableBlocks().map((block) => (
                  <TouchableOpacity
                    key={block}
                    onPress={() => setSelectedBlock(block)}
                    className={`mr-2 px-4 py-2 rounded-lg ${
                      selectedBlock === block
                        ? "bg-blue-500"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <Text
                      className={
                        selectedBlock === block ? "text-white" : "text-gray-700"
                      }
                    >
                      Dãy {block}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Lọc theo tầng */}
              <Text className="text-gray-700 mb-2 font-medium">Tầng</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-6"
              >
                <TouchableOpacity
                  onPress={() => setSelectedFloor("")}
                  className={`mr-2 px-4 py-2 rounded-lg ${
                    selectedFloor === ""
                      ? "bg-blue-500"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <Text
                    className={
                      selectedFloor === "" ? "text-white" : "text-gray-700"
                    }
                  >
                    Tất cả
                  </Text>
                </TouchableOpacity>
                {getAvailableFloors().map((floor) => (
                  <TouchableOpacity
                    key={floor}
                    onPress={() => setSelectedFloor(floor)}
                    className={`mr-2 px-4 py-2 rounded-lg ${
                      selectedFloor === floor
                        ? "bg-blue-500"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <Text
                      className={
                        selectedFloor === floor ? "text-white" : "text-gray-700"
                      }
                    >
                      Tầng {floor}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Nút áp dụng */}
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                className="bg-blue-500 py-3 rounded-xl"
              >
                <Text className="text-white text-center font-semibold">
                  Áp dụng
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Nút lọc theo trạng thái */}
      <View className="flex-row justify-center gap-x-3 mb-6 px-6">
        <TouchableOpacity
          className={`py-2.5 px-6 rounded-xl ${
            buttonColor === undefined
              ? "bg-blue-500 shadow-lg"
              : "bg-white border border-gray-200"
          }`}
          onPress={() => handleStatusFilter(undefined)}
        >
          <Text
            className={`${
              buttonColor === undefined ? "text-white" : "text-gray-700"
            } font-semibold`}
          >
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatusFilter("vacant")}>
          <Text
            className="font-semibold py-2.5 px-6 rounded-xl"
            style={{
              backgroundColor: buttonColor === "vacant" ? "#22c55e" : "#fff",
              color: buttonColor === "vacant" ? "#fff" : "#374151",
              shadowColor: buttonColor === "vacant" ? "#22c55e" : undefined,
              shadowOpacity: buttonColor === "vacant" ? 0.5 : 0,
              borderWidth: buttonColor === "vacant" ? 0 : 1,
              borderColor: buttonColor === "vacant" ? "transparent" : "#e5e7eb",
            }}
          >
            Phòng trống
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatusFilter("occupied")}>
          <Text
            className="font-semibold py-2.5 px-6 rounded-xl"
            style={{
              backgroundColor: buttonColor === "occupied" ? "#ef4444" : "#fff",
              color: buttonColor === "occupied" ? "#fff" : "#374151",
              shadowColor: buttonColor === "occupied" ? "#ef4444" : undefined,
              shadowOpacity: buttonColor === "occupied" ? 0.5 : 0,
              borderWidth: buttonColor === "occupied" ? 0 : 1,
              borderColor:
                buttonColor === "occupied" ? "transparent" : "#e5e7eb",
            }}
          >
            Đã thuê
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading và Error states */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-gray-600 font-medium">
            Đang tải danh sách phòng...
          </Text>
        </View>
      ) : (
        <ScrollView className="px-6">
          {filteredRooms.length === 0 ? (
            <View className="py-12 items-center">
              <Ionicons name="search" size={60} color="#94a3b8" />
              <Text className="text-gray-500 text-lg font-medium mt-4">
                Không tìm thấy phòng
              </Text>
            </View>
          ) : (
            filteredRooms.map((room) => (
              <View
                key={room.id}
                className={`bg-white rounded-2xl p-6 mb-6 shadow-lg ${
                  room.status === "vacant"
                    ? "border-l-4 border-green-500"
                    : "border-l-4 border-red-500"
                }`}
              >
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="text-gray-500 font-medium">Phòng</Text>
                    <Text className="text-3xl font-bold text-[#1a2b47] mt-1">
                      {room.roomNumber}
                    </Text>
                    <Text className="mt-3 text-gray-600">
                      {room.description}
                    </Text>
                    <View
                      className={`mt-4 px-4 py-2 rounded-xl self-start ${
                        room.status === "vacant"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <Text className="font-semibold">
                        {getStatusText(room.status)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    className={`${
                      room.status === "vacant"
                        ? "bg-blue-500 shadow-lg shadow-blue-500/50"
                        : "bg-gray-300"
                    } px-8 py-3 rounded-xl`}
                    disabled={room.status !== "vacant"}
                  >
                    <Text className="text-white font-semibold">Thuê</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row justify-end mt-4">
                  <View>
                    <Text className="text-gray-500 text-right">
                      Chi phí tháng
                    </Text>
                    <Text className="text-2xl font-bold text-[#1a2b47] mt-1">
                      ${room.price}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
      <BottomTabs />
    </View>
  );
};

export default RoomScreen;
