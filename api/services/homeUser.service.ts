import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://103.167.89.178:3000/api";

async function getToken(): Promise<string | null> {
  // if (Platform.OS === "web") {
  return await AsyncStorage.getItem("userToken");
  // } else {
  //   return await SecureStore.getItemAsync("userToken");
  // }
}

export async function getOngoingElectionId(): Promise<number | null> {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/election`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch election list");

  const json = await res.json();
  const elections = Array.isArray(json) ? json : json.data;
  const ongoing = elections.find((e: any) => e.status === "ongoing");

  return ongoing ? ongoing.id : null;
}

export async function getElectionResults(electionId: number) {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/election/${electionId}/results`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch election results");
  const data = await res.json();
  return data;
}
