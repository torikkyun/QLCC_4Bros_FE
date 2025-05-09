// services/room.service.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchRoomByEmail = async () => {
  try {
    const email = await AsyncStorage.getItem('selectedUserEmail');
    if (!email) throw new Error('No email found in storage');

    const response = await fetch('http://103.167.89.178:3000/api/room?page=1&limit=10&order=desc');
    const json = await response.json();

    const matchedRoom = json.data.find((room: any) => room.user?.email === email);

    return matchedRoom || null;
  } catch (error) {
    console.error('Error fetching room:', error);
    throw error;
  }
};
