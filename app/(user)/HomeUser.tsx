import React, { useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import BottomTabs from "@/components/BottomTabs";
import FloatingButton from "@/components/FloatingButton";
import { useHomeUser } from "@/hooks/useHomeUser";

export default function HomeScreen() {
  const { candidate, loading, error, electionId } = useHomeUser();
  const router = useRouter();
  // Animation values for Card1 (from left) and Card2 (from right)
  const card1TranslateX = useSharedValue(-300); // Start off-screen to the left
  const card2TranslateX = useSharedValue(300); // Start off-screen to the right

  // Animated styles for cards
  const card1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: card1TranslateX.value }],
  }));

  const card2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: card2TranslateX.value }],
  }));

  // Trigger animation on mount
  useEffect(() => {
    card1TranslateX.value = withTiming(0, { duration: 800 }); // Slide Card1 to original position
    card2TranslateX.value = withTiming(0, { duration: 800 }); // Slide Card2 to original position
  }, [card1TranslateX, card2TranslateX]);

  return (
    <ImageBackground
      source={require("@/assets/images/bgchungcu.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Chào mừng đến chung cư 4BROS</Text>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <Pressable style={[styles.tabButton, styles.activeTab]}>
              <Text style={styles.activeTabText}>Trang chủ</Text>
            </Pressable>
            <Pressable
              style={styles.tabButton}
              onPress={() => router.push("../Rooms")}
            >
              <Text style={styles.inactiveTabText}>Danh sách phòng</Text>
            </Pressable>
          </View>

          {/* Cards */}
          <View style={styles.cardWrapper}>
            {/* Card 1 */}
            <Animated.View style={[card1AnimatedStyle]}>
              <View
                style={[
                  styles.card,
                  styles.cardGradient,
                  styles.cardShadow,
                  { height: 220, marginBottom: 32 },
                ]}
              >
                <View style={styles.cardLeft}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : error ? (
                    <Text style={styles.cardDesc}>{error}</Text>
                  ) : (
                    <>
                      <Text style={styles.cardTitle}>{candidate?.name}</Text>
                      <Text style={styles.cardDesc}>
                        Điểm bình chọn: {candidate?.voteCount}
                        {"\n"}
                        {candidate?.description}
                      </Text>
                      <Pressable
                        style={styles.voteButton}
                        onPress={() =>
                          router.push({
                            pathname: "../(user)/Votes",
                            params: { id: electionId },
                          })
                        }
                      >
                        <Text style={styles.voteButtonText}>Bình Chọn</Text>
                      </Pressable>
                    </>
                  )}
                </View>
                <View style={styles.cardRight}>
                  <Image
                    source={require("@/assets/images/ducphuc.jpg")}
                    resizeMode="cover"
                    style={styles.cardImage}
                  />
                </View>
              </View>
            </Animated.View>

            {/* Card 2 */}
            <Animated.View style={[card2AnimatedStyle]}>
              <View
                style={[
                  styles.card,
                  styles.cardShadow,
                  { height: 220, marginTop: 32 },
                ]}
              >
                <View style={[styles.cardLeft, styles.card2Left]}>
                  <Text style={styles.cardTitle}>Chi phí tháng này</Text>
                  <Text style={styles.cardDesc}>
                    Điện: 1000kw {"\n"}Nước: 100 m3
                  </Text>
                  <Pressable
                    style={styles.payButton}
                    onPress={() => router.push("./Payment")}
                  >
                    <Text style={styles.payButtonText}>Thanh Toán</Text>
                  </Pressable>
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.dollarSign}>
                    <Image
                      source={require("@/assets/images/istockphoto-1302890997-612x612.jpg")}
                    />
                  </Text>
                </View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
        <FloatingButton />
        <BottomTabs />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
  },
  container: {
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background for readability
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000", // Ensure text is readable on background
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 50,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 50,
  },
  activeTab: {
    backgroundColor: "#4f46e5",
  },
  activeTabText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  inactiveTabText: {
    color: "#333333",
  },
  cardWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    flexDirection: "row",
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
  },
  cardGradient: {
    backgroundColor: "#6366f1",
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  cardLeft: {
    flex: 6,
    padding: 16,
  },
  cardRight: {
    flex: 5,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  card2Left: {
    backgroundColor: "#9333ea",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    lineHeight: 25,
    marginTop: 1,
  },
  cardDesc: {
    color: "#ffffff",
    fontSize: 18,
    lineHeight: 25,
    marginTop: 8,
  },
  voteButton: {
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    marginTop: 52,
  },
  voteButtonText: {
    color: "#4f46e5",
    fontWeight: "800",
    fontSize: 18,
  },
  payButton: {
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    marginTop: 52,
  },
  payButtonText: {
    color: "#9333ea",
    fontWeight: "800",
    fontSize: 18,
  },
  dollarSign: {
    fontSize: 160,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    lineHeight: 200,
  },
});
