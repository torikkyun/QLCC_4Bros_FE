const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

const config = getDefaultConfig(__dirname);

// Áp dụng NativeWind trước
const nativeWindConfig = withNativeWind(config, { input: "./global.css" });

// Sau đó bọc toàn bộ config với Reanimated
module.exports = wrapWithReanimatedMetroConfig(nativeWindConfig);
