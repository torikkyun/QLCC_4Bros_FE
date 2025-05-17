import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useUserList } from '../../hooks/userList.hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import BottomTabsAdmin from '@/components/BottomTabsAdmin';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function UserList() {
  const { users, loading, error } = useUserList();
  const router = useRouter();

  const handleViewUser = async (user: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    const fullName = `${user.firstName} ${user.lastName}`;
    await AsyncStorage.setItem('selectedUserName', fullName);
    await AsyncStorage.setItem('selectedUserEmail', user.email);
    router.push('./userInfo');
  };

  const randomLocation = () => {
    const locations = ['Bình Dương', 'Đồng Nai', 'Biên Hòa'];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  return (
    <View style={{flex: 1,}}>

    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>4Bros</Text>
        <Feather name="menu" size={24} color="black" />
      </View>

      <Text style={styles.title}>Danh sách người dùng</Text>

      {/* <View style={styles.searchBox}>
        <TextInput
          placeholder="Search name, email, id"
          style={styles.searchInput}
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View> */}

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.userInfo}>
                <Image
                  source={{
                    uri: `https://ui-avatars.com/api/?name=${item.firstName}+${item.lastName}`,
                  }}
                  style={styles.avatar}
                />
                <Text style={styles.userName}>
                  {item.firstName} {item.lastName}
                </Text>
              </View>
              <Text style={styles.timestamp}>14 min</Text>
            </View>

            <Text style={styles.email}>{item.email}</Text>

            <View style={styles.cardFooter}>
              <Text style={styles.location}>{randomLocation()}</Text>
              <Pressable
                style={styles.viewButton}
                onPress={() => handleViewUser(item)}
              >
                <Text style={styles.viewButtonText}>View</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
      <BottomTabsAdmin />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: '#374151',
  },
  searchIcon: {
    fontSize: 18,
    color: '#6b7280',
    marginLeft: 8,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#dbeafe',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  timestamp: {
    fontSize: 12,
    color: '#6b7280',
  },
  email: {
    fontSize: 12,
    color: '#4b5563',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  location: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  viewButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
});
