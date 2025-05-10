// kiểm tra đang dùng giả lập web hay không, nếu dùng giả lập web thì lấy token từ asyncstorage còn không thì securestorage
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'userToken';

export const saveToken = async (token: string) => {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
};

export const getToken = async (): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } else {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  }
};

export const deleteToken = async () => {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};
