import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://103.167.89.178:3000/api";

async function getToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return await AsyncStorage.getItem("userToken");
  } else {
    return await SecureStore.getItemAsync("userToken");
  }
}

export async function fetchRooms() {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/room?page=1&limit=10&order=desc`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Không thể lấy danh sách phòng");
  const json = await res.json();
  return json.data;
}

export async function deleteRoom(id: number) {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/room/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Không thể xóa phòng");
  return await res.json();
}
