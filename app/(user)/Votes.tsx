import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomTabs from "@/components/BottomTabs";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { electionsService } from "@/api/services/elections.service";
import { useVotes } from "@/hooks/useVotes";

const { width } = Dimensions.get("window");

const VotesScreen = () => {
  // const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = React.useRef<FlatList>(null);
  // const [candidates, setCandidates] = useState([]);
  // const [loading, setLoading] = useState(true);
  const { id } = useLocalSearchParams();
  const {
    activeIndex,
    setActiveIndex,
    candidates,
    loading,
    voting,
    handleVote,
    hasVoted,
    electionStatus,
    votedCandidate,
  } = useVotes(id);

  const goToPrevious = () => {
    if (activeIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex - 1,
        animated: true,
      });
    }
  };

  const goToNext = () => {
    if (activeIndex < candidates.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    }
  };

  const renderUser = ({ item, index }: { item: any; index: number }) => {
    const handleVoteConfirmation = () => {
      Alert.alert(
        "Xác nhận bình chọn",
        `Bạn có chắc chắn muốn bình chọn cho ${item.user.firstName} ${item.user.lastName}?`,
        [
          {
            text: "Hủy",
            style: "cancel",
          },
          {
            text: "Đồng ý",
            onPress: () => handleVote(item.candidateId),
          },
        ]
      );
    };

    return (
      <View style={{ width }} className="items-center px-4">
        <LinearGradient
          colors={["#917AFD", "#6246EA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-full max-w-3xs rounded-3xl overflow-hidden p-4"
        >
          {/* Ảnh người dùng */}
          <View className="p-4">
            <Image
              source={require("@/assets/images/fubuki.jpg")}
              className="w-full h-48 rounded-lg"
              resizeMode="cover"
            />
          </View>

          {/* Thông tin người dùng */}
          <View className="items-center px-4 mt-2">
            <Text className="text-white text-2xl font-bold">
              {item.user.firstName} {item.user.lastName}
            </Text>
            <Text className="text-white text-base">
              Điểm bình chọn: {item.voteCount}
            </Text>
            <Text className="text-white text-sm mt-1">{item.description}</Text>
          </View>

          {/* Nút bình chọn */}
          <View className="items-center mt-24 pb-2">
            <TouchableOpacity
              className={`rounded-full py-3 px-8 ${
                hasVoted || electionStatus === "completed"
                  ? "bg-gray-300"
                  : "bg-white"
              }`}
              onPress={handleVoteConfirmation}
              disabled={voting || hasVoted || electionStatus === "completed"}
            >
              <Text
                className={`font-bold ${
                  hasVoted || electionStatus === "completed"
                    ? "text-gray-600"
                    : "text-[#6246EA]"
                }`}
              >
                {voting
                  ? "Đang xử lý..."
                  : hasVoted
                  ? votedCandidate &&
                    votedCandidate.user &&
                    votedCandidate.user.firstName &&
                    votedCandidate.user.lastName
                    ? `Đã bình chọn: ${votedCandidate.user.firstName} ${votedCandidate.user.lastName}`
                    : "Đã bình chọn"
                  : electionStatus === "completed"
                  ? "Đã kết thúc"
                  : "Bình Chọn"}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold ml-2">Bình chọn</Text>
        </View>
        <TouchableOpacity className="bg-teal-500 rounded-full px-4 py-1">
          <Text className="text-white font-medium">Đăng ký ứng cử viên</Text>
        </TouchableOpacity>
      </View>

      {/* Khoảng trống phía trên */}
      <View className="flex-1" />

      {/* Danh sách người dùng với nút điều hướng */}
      <View className="flex-2 justify-center">
        {/* Nút mũi tên trái */}
        {activeIndex > 0 && (
          <TouchableOpacity
            onPress={goToPrevious}
            className="absolute left-2 z-10 bg-white/50 rounded-full p-2"
            style={{ top: "50%", transform: [{ translateY: -20 }] }}
          >
            <Ionicons name="chevron-back" size={30} color="#6246EA" />
          </TouchableOpacity>
        )}
        {loading ? (
          <View className="items-center justify-center">
            <Text>Đang tải...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={candidates}
            renderItem={renderUser}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setActiveIndex(newIndex);
            }}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
          />
        )}
        {/* Nút mũi tên phải */}
        {activeIndex < candidates.length - 1 && (
          <TouchableOpacity
            onPress={goToNext}
            className="absolute right-2 z-10 bg-white/50 rounded-full p-2"
            style={{ top: "50%", transform: [{ translateY: -20 }] }}
          >
            <Ionicons name="chevron-forward" size={30} color="#6246EA" />
          </TouchableOpacity>
        )}
      </View>

      {/* Chỉ báo trang hiện tại */}
      {!loading && (
        <View className="flex-row justify-center mt-4">
          {candidates.map((_, index) => (
            <View
              key={index}
              className={`h-2 w-2 rounded-full mx-1 ${
                index === activeIndex ? "bg-[#6246EA]" : "bg-gray-300"
              }`}
            />
          ))}
        </View>
      )}

      {/* Khoảng trống phía dưới */}
      <View className="flex-1" />

      <View className="mt-auto">
        <BottomTabs />
      </View>
    </View>
  );
};

export default VotesScreen;
