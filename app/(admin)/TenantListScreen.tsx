import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomTabsAdmin from "@/components/BottomTabsAdmin";
import { useRouter } from "expo-router";

// Định nghĩa kiểu cho user trong API
interface ApiUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

// Định nghĩa kiểu cho mỗi item trong API response (election results)
interface ApiCandidate {
  candidateId: number;
  description: string;
  user: ApiUser;
  voteCount: string;
}

// Định nghĩa kiểu cho candidate từ API GET /candidate
interface ApiAvailableCandidate {
  id: number;
  description: string;
  user: ApiUser;
}

// Định nghĩa kiểu cho response từ API GET /candidate
interface ApiCandidateResponse {
  data: ApiAvailableCandidate[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Định nghĩa kiểu cho candidate hiển thị trên giao diện
interface Candidate {
  id: string;
  name: string;
  voteCount: number;
  email: string;
  description: string;
}

// Định nghĩa kiểu cho available candidate trong modal
interface AvailableCandidate {
  id: string;
  name: string;
  email: string;
  description: string;
}

const TenantListScreen: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [availableCandidates, setAvailableCandidates] = useState<
    AvailableCandidate[]
  >([]);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>(
    []
  );
  const router = useRouter();

  // API endpoints
  const RESULTS_API_URL = "http://103.167.89.178:3000/api/election/1/results";
  const CANDIDATE_API_URL =
    "http://103.167.89.178:3000/api/candidate?page=1&limit=10&order=desc";
  const ADD_CANDIDATE_API_URL =
    "http://103.167.89.178:3000/api/election/1/candidate";
  const DELETE_CANDIDATE_API_URL =
    "http://103.167.89.178:3000/api/election/1/candidate"; // Endpoint để xóa ứng cử viên

  // Hàm lấy token từ AsyncStorage
  const getToken = async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("Retrieved token:", token ? token : "No token found");
      return token;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  };

  // Ánh xạ dữ liệu từ API election results thành Candidate
  const mapApiCandidateToCandidate = (
    apiCandidate: ApiCandidate
  ): Candidate => ({
    id: apiCandidate.candidateId.toString(),
    name: `${apiCandidate.user.firstName} ${apiCandidate.user.lastName}`,
    voteCount: parseInt(apiCandidate.voteCount, 10) || 0,
    email: apiCandidate.user.email,
    description: apiCandidate.description,
  });

  // Ánh xạ dữ liệu từ API candidate thành AvailableCandidate
  const mapApiAvailableCandidateToAvailableCandidate = (
    apiCandidate: ApiAvailableCandidate
  ): AvailableCandidate => ({
    id: apiCandidate.id.toString(),
    name: `${apiCandidate.user.firstName} ${apiCandidate.user.lastName}`,
    email: apiCandidate.user.email,
    description: apiCandidate.description,
  });

  // Lấy danh sách ứng cử viên từ API election results
  const fetchCandidates = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert(
          "Authentication Required",
          "No authentication token found. Please log in.",
          [{ text: "OK", onPress: () => router.push("/Login") }]
        );
        return;
      }

      console.log("Fetching candidates from:", RESULTS_API_URL);
      console.log("Using token:", token);
      const response = await axios.get<ApiCandidate[]>(RESULTS_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API response (results):", response.data);
      const mappedCandidates = response.data.map(mapApiCandidateToCandidate);
      setCandidates(mappedCandidates);
    } catch (error: any) {
      console.error(
        "Error fetching candidates:",
        error.message,
        error.response?.data,
        error.response?.status
      );
      if (error.response?.status === 401) {
        Alert.alert(
          "Unauthorized",
          "Invalid or expired token. Please log in again.",
          [{ text: "OK", onPress: () => router.push("/Login") }]
        );
      } else {
        Alert.alert("Error", `Failed to load candidates: ${error.message}`);
      }
    }
  };

  // Gọi fetchCandidates ngay khi trang được tải lần đầu
  useEffect(() => {
    fetchCandidates();
  }, []); // Chỉ chạy một lần khi component mount

  // Làm mới danh sách ứng cử viên
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert(
          "Authentication Required",
          "No authentication token found. Please log in.",
          [{ text: "OK", onPress: () => router.push("/Login") }]
        );
        setRefreshing(false);
        return;
      }

      console.log("Refreshing candidates from:", RESULTS_API_URL);
      const response = await axios.get<ApiCandidate[]>(RESULTS_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Refresh API response:", response.data);
      const mappedCandidates = response.data.map(mapApiCandidateToCandidate);
      setCandidates(mappedCandidates);
    } catch (error: any) {
      console.error(
        "Error refreshing candidates:",
        error.message,
        error.response?.data,
        error.response?.status
      );
      if (error.response?.status === 401) {
        Alert.alert(
          "Unauthorized",
          "Invalid or expired token. Please log in again.",
          [{ text: "OK", onPress: () => router.push("/Login") }]
        );
      } else {
        Alert.alert("Error", `Failed to refresh candidates: ${error.message}`);
      }
    } finally {
      setRefreshing(false);
    }
  };

  // Lấy danh sách ứng cử viên có sẵn từ API candidate
  const fetchAvailableCandidates = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert(
          "Authentication Required",
          "No authentication token found. Please log in.",
          [{ text: "OK", onPress: () => router.push("/Login") }]
        );
        return;
      }

      console.log("Fetching available candidates from:", CANDIDATE_API_URL);
      const response = await axios.get<ApiCandidateResponse>(
        CANDIDATE_API_URL,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("API response (candidates):", response.data);
      const mappedCandidates = response.data.data.map(
        mapApiAvailableCandidateToAvailableCandidate
      );

      // Pre-check candidates that are already in the election
      const existingCandidateIds = candidates.map((c) => c.id);
      const preSelectedIds = mappedCandidates
        .filter((c) => existingCandidateIds.includes(c.id))
        .map((c) => c.id);

      setAvailableCandidates(mappedCandidates);
      setSelectedCandidateIds(preSelectedIds);
      setModalVisible(true);
    } catch (error: any) {
      console.error(
        "Error fetching available candidates:",
        error.message,
        error.response?.data,
        error.response?.status
      );
      if (error.response?.status === 401) {
        Alert.alert(
          "Unauthorized",
          "Invalid or expired token. Please log in again.",
          [{ text: "OK", onPress: () => router.push("/Login") }]
        );
      } else {
        Alert.alert(
          "Error",
          `Failed to load available candidates: ${error.message}`
        );
      }
    }
  };

  // Thêm ứng cử viên vào cuộc bầu cử
  const addCandidatesToElection = async () => {
    if (selectedCandidateIds.length === 0) {
      Alert.alert("Error", "Please select at least one candidate.");
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        Alert.alert(
          "Authentication Required",
          "No authentication token found. Please log in.",
          [{ text: "OK", onPress: () => router.push("/Login") }]
        );
        return;
      }

      console.log("Adding candidates to election:", selectedCandidateIds);
      const response = await axios.put<{ success: boolean }>(
        ADD_CANDIDATE_API_URL,
        {
          candidateIds: selectedCandidateIds.map((id) => parseInt(id)),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Add candidate response:", response.data);
      if (response.data.success) {
        Alert.alert("Success", "Candidates added successfully.");
        setModalVisible(false);
        setSelectedCandidateIds([]);
        fetchCandidates(); // Làm mới danh sách ứng cử viên
      } else {
        Alert.alert("Error", "Failed to add candidates.");
      }
    } catch (error: any) {
      console.error(
        "Error adding candidates:",
        error.message,
        error.response?.data,
        error.response?.status
      );
      if (error.response?.status === 401) {
        Alert.alert(
          "Unauthorized",
          "Invalid or expired token. Please log in again.",
          [{ text: "OK", onPress: () => router.push("/Login") }]
        );
      } else {
        Alert.alert("Error", `Failed to add candidates: ${error.message}`);
      }
    }
  };

  // Xóa ứng cử viên khỏi cuộc bầu cử
  const deleteCandidate = async (candidateId: string) => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert(
          "Authentication Required",
          "No authentication token found. Please log in.",
          [{ text: "OK", onPress: () => router.push("/Login") }]
        );
        return;
      }

      console.log(`Deleting candidate with ID: ${candidateId}`);
      const response = await axios.delete<{ success: boolean }>(
        `${DELETE_CANDIDATE_API_URL}/${candidateId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Delete candidate response:", response.data);
      if (response.data.success) {
        Alert.alert("Success", "Candidate deleted successfully.");
        fetchCandidates(); // Làm mới danh sách ứng cử viên
      } else {
        Alert.alert("Error", "Failed to delete candidate.");
      }
    } catch (error: any) {
      console.error(
        "Error deleting candidate:",
        error.message,
        error.response?.data,
        error.response?.status
      );
      if (error.response?.status === 401) {
        Alert.alert(
          "Unauthorized",
          "Invalid or expired token. Please log in again.",
          [{ text: "OK", onPress: () => router.push("/Login") }]
        );
      } else if (error.response?.status === 404) {
        Alert.alert("Error", "Candidate not found.");
      } else {
        Alert.alert("Error", `Failed to delete candidate: ${error.message}`);
      }
    }
  };

  // Xử lý chọn/bỏ chọn ứng cử viên
  const toggleCandidateSelection = (id: string) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  // Tìm kiếm candidates
  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Render item cho danh sách ứng cử viên trong election
  const renderItem = ({ item }: { item: Candidate }) => (
    <View className="flex-row items-center bg-[#e6f0fa] p-3 rounded-xl mb-2">
      <Image
        source={{ uri: "https://via.placeholder.com/40" }}
        className="w-10 h-10 rounded-full mr-3"
      />
      <View className="flex-1">
        <Text className="text-base font-medium">{item.name}</Text>
        <Text className="text-sm text-gray-600">
          Email: <Text className="font-bold">{item.email}</Text>
        </Text>
        <Text className="text-sm text-gray-600">
          Description: <Text className="font-bold">{item.description}</Text>
        </Text>
        <Text className="text-sm text-gray-600">
          Vote Count: <Text className="font-bold">{item.voteCount}</Text>
        </Text>
      </View>
      <View className="items-end">
        <View className="flex-row">
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Confirm Delete",
                `Are you sure you want to delete ${item.name}?`,
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    onPress: () => deleteCandidate(item.id),
                    style: "destructive",
                  },
                ]
              )
            }
            className="mr-3"
          >
            <Ionicons name="trash" size={20} color="#ff4444" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Not Supported",
                "Editing candidates is not supported."
              )
            }
          >
            <Ionicons name="pencil" size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Render item cho danh sách ứng cử viên có sẵn trong modal
  const renderAvailableCandidateItem = ({
    item,
  }: {
    item: AvailableCandidate;
  }) => (
    <TouchableOpacity
      onPress={() => toggleCandidateSelection(item.id)}
      className="flex-row items-center p-3 bg-[#e6f0fa] rounded-xl mb-2"
    >
      <View
        className={`w-6 h-6 mr-3 border-2 rounded ${
          selectedCandidateIds.includes(item.id) ? "bg-violet-700" : "bg-white"
        }`}
      >
        {selectedCandidateIds.includes(item.id) && (
          <Ionicons name="checkmark" size={18} color="white" />
        )}
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium">{item.name}</Text>
        <Text className="text-sm text-gray-600">
          Email: <Text className="font-bold">{item.email}</Text>
        </Text>
        <Text className="text-sm text-gray-600">
          Description: <Text className="font-bold">{item.description}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Ionicons name="arrow-back" size={24} color="#1a3c5e" />
          <Text className="text-2xl font-bold text-[#1a3c5e] ml-2">
            Rentaxo
          </Text>
        </View>
        <Ionicons name="menu" size={24} color="#1a3c5e" />
      </View>
      {/* Title và nút thêm ứng cử viên */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-semibold">Candidate List</Text>
        <TouchableOpacity
          onPress={fetchAvailableCandidates}
          className="bg-violet-700 px-3 py-2 rounded-lg"
        >
          <Text className="text-white font-medium">Add Candidate</Text>
        </TouchableOpacity>
      </View>
      {/* Search Bar */}
      <View className="flex-row items-center bg-[#e6f0fa] p-3 rounded-2xl mb-4">
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          className="flex-1 mx-2 text-base"
          placeholder="Search name"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Ionicons name="options" size={20} color="#888" />
      </View>
      {/* Candidate List */}
      <FlatList
        data={filteredCandidates}
        keyExtractor={(item: Candidate) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text className="text-center text-gray-500">No candidates found</Text>
        }
      />
      {/* Modal chọn ứng cử viên */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center p-4">
          <View className="bg-white rounded-xl p-4 max-h-[80%]">
            <Text className="text-xl font-semibold mb-4">
              Select Candidates
            </Text>
            <FlatList
              data={availableCandidates}
              keyExtractor={(item) => item.id}
              renderItem={renderAvailableCandidateItem}
              ListEmptyComponent={
                <Text className="text-center text-gray-500">
                  No candidates available
                </Text>
              }
            />
            <View className="flex-row justify-end mt-4">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="px-4 py-2 mr-2"
              >
                <Text className="text-gray-600">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={addCandidatesToElection}
                className="bg-violet-700 px-4 py-2 rounded-lg"
              >
                <Text className="text-white">Add Selected</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* Bottom Navigation */}
      <View>
        <BottomTabsAdmin />
      </View>
    </View>
  );
};

export default TenantListScreen;
