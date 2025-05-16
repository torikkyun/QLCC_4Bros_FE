import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Pressable
} from 'react-native';
import { useRouter } from "expo-router";
import BottomTabsAdmin from '@/components/BottomTabsAdmin';
import { Ionicons, Feather } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InputLayout() {
  const [image, setImage] = useState<string | null>(null);

  const [roomData, setRoomData] = useState({
  id: '',
  status: '',
  price: '',
  description: '',
  userName: '',
  roomNumber:'',
});

  const [formData, setFormData] = useState({
  roomNumber: '',
  price: '',
  description: '',
});


  useEffect(() => {
  const loadRoomInfo = async () => {
    const values = await AsyncStorage.multiGet([
      'roomId',
      'roomStatus',
      'roomPrice',
      'roomDescription',
      'roomUserName',
      'roomNumber'
    ]);
    
    const data: any = {};
    values.forEach(([key, value]) => {
      if (key && value) data[key] = value;
    });
    setRoomData({
      id: data.roomId,
      status: data.roomStatus,
      price: data.roomPrice,
      description: data.roomDescription,
      userName: data.roomUserName,
      roomNumber: data.roomNumber,
    });
    setFormData({
    roomNumber: data.roomNumber, 
    price: data.roomPrice,
    description: data.roomDescription,
});
  };

  loadRoomInfo();
}, []);

const router= useRouter();
  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text className="text-lg font-bold">4Bros</Text>
        <Feather name="menu" size={24} color="black" />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>ID Phòng: {roomData.id}</Text>
        <View style={styles.container}>

          <View>
          <Text style={styles.label}>Trạng Thái</Text>
          <TextInput
            style={styles.singleInput}
            placeholder="Trạng thái"
            placeholderTextColor="#888"
            value={roomData.status}
          />
          </View>

          <View>
          <Text style={styles.label}>Số Phòng</Text>
          <TextInput
                style={styles.singleInput}
                placeholder="Số Phòng"
                placeholderTextColor="#888"
                value={formData.roomNumber}
                onChangeText={(text) => setFormData({ ...formData, roomNumber: text })}
              />
          </View>

          <View style={styles.row}>

            <View style={styles.col}>
            <Text style={styles.label}>Người Thuê</Text>
            <TextInput
              style={styles.halfInput}
              placeholder="Người thuê"
              placeholderTextColor="#888"
              value={roomData.userName}
              editable={false}
            />
            </View>

            <View style={styles.col}>
            <Text style={styles.label}>Giá</Text>
            <TextInput
              style={styles.halfInput}
              placeholder="Giá"
              placeholderTextColor="#888"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
            />
            </View>
          </View>
          <View style={{ height: "40%" }}>
          <Text style={styles.label}>Mô Tả</Text>
          <TextInput
            style={[
              styles.singleInput,
              { height: '60%', textAlignVertical: 'top' },
            ]}
            placeholder="Mô tả"
            multiline={true}
            placeholderTextColor="#888"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
          />
          <TouchableOpacity style={styles.submitButton} onPress={async () => {
              try {
                const token = await AsyncStorage.getItem('userToken');
                const roomId = roomData.id;

                const res = await fetch(`http://103.167.89.178:3000/api/room/${roomId}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    roomNumber: formData.roomNumber,
                    price: Number(formData.price),
                    description: formData.description,
                  }),
                });

                if (!res.ok) {
                  const err = await res.json();
                  console.error('Update failed:', err);
                  alert(err.message || 'Cập nhật thất bại!');
                  return;
                }

                alert('Cập nhật thành công!');
              } catch (error) {
                console.error('Error during update:', error);
                alert('Lỗi khi cập nhật phòng');
              }
            }}
            >
                    <Text style={styles.submitText}>Xác nhận</Text>
          </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
          <BottomTabsAdmin/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    flexGrow: 1,
    gap: 10,
  },
  singleInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9F9F9',
  },
  row: {
    flexDirection: 'row',
    justifyContent:"space-between",
    gap: 16,
  },
  halfInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9F9F9',
    height:"30%",
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 20,
    width: '80%',
    backgroundColor: '#13C39C',
    paddingVertical: 14,
    borderRadius: 8,
    alignSelf: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
  fontSize: 12,
  color: '#888',
  marginBottom: 4,
  marginLeft: 2,
},
  col: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width:"45%",
  },
});
