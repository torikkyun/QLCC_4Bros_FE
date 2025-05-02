import React from "react";
import { Image, Pressable } from "react-native";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { router } from "expo-router";

export default function FloatingButton() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx: any) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        style={[
          { position: "absolute", bottom: 100, right: 20 },
          animatedStyle,
        ]}
      >
        <Pressable
          onPress={() => router.push("/user/screens/Notifications")} // dẫn đến trang khiếu nại
          style={{ width: 60, height: 60 }}
        >
          <Image
            source={require("../../assets/images/Logo4Bros.png")}
            style={{ width: "100%", height: "100%", borderRadius: 30 }}
            resizeMode="contain"
          />
        </Pressable>
      </Animated.View>
    </PanGestureHandler>
  );
}
