import React from 'react';
import { View, Text, TextInput, FlatList, Image, Pressable, ActivityIndicator } from 'react-native';
import { useUserList } from '../../hooks/userList.hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import BottomTabsAdmin from '@/components/BottomTabsAdmin';
import {Ionicons, Feather  } from '@expo/vector-icons';
export default function UserList() {
  const { users, loading, error } = useUserList();
  const router = useRouter(); // dùng để điều hướng

  const handleViewUser = async (user: { firstName: string; lastName: string; email: string }) => {
    const fullName = `${user.firstName} ${user.lastName}`;
    await AsyncStorage.setItem('selectedUserName', fullName);
    await AsyncStorage.setItem('selectedUserEmail', user.email);
    router.push('./userInfo');
  };
  return (
    <View className="flex-1 bg-white px-4 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text className="text-lg font-bold">4Bros</Text>
        <Feather name="menu" size={24} color="black" />
      </View>

      <Text className="text-center text-lg font-semibold text-gray-800 mb-4">Danh sách người dùng</Text>

      <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mb-4">
        <TextInput
          placeholder="Search name, email, id"
          className="flex-1 text-gray-700"
        />
        <Text className="text-gray-500 text-xl">🔍</Text>
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text className="text-red-500">{error}</Text>}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="bg-blue-100 p-4 rounded-xl mb-3" >
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center">
                <Image
                  source={{
                    uri: `https://ui-avatars.com/api/?name=${item.firstName}+${item.lastName}`,
                  }}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <Text className="text-base font-semibold text-gray-800">
                  {item.firstName} {item.lastName}
                </Text>
              </View>
              <Text className="text-xs text-gray-500">14 min</Text>
            </View>
            <Text className="text-xs text-gray-600">{item.email}</Text>
            <View className="flex-row justify-between items-center mt-1">
              <Text className="text-base font-bold text-blue-800">in Unknown</Text>
              <Pressable
                className="bg-blue-500 px-4 py-1 rounded-full"
                onPress={() => handleViewUser(item)}
              >
                <Text className="text-white font-medium text-sm">View</Text>
              </Pressable>
            </View>
          </View>
        )}
        />
        <BottomTabsAdmin/>
    </View>

  );
}
