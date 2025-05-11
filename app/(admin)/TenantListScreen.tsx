
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
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [electionId, setElectionId] = useState<string | null>(null);
  const router = useRouter();

  // API endpoints
  const BASE_API_URL = "http://103.167.89.178:3000/api";
  const CANDIDATE_API_URL = `${BASE_API_URL}/candidate?page=1&limit=10&order=desc`;
  const DELETE_CANDIDATE_API_URL = `${BASE_API_URL}/candidate`;

  // Hàm lấy electionId từ AsyncStorage
  const getElectionId = async (): Promise<string | null> => {
    try {
      const id = await AsyncStorage.getItem("selectedElectionId");
      console.log("Retrieved election ID:", id ? id : "No election ID found");
      return id;
    } catch (error) {
      console.error("Error retrieving election ID:", error);
      return null;
    }
  };

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

  // Lấy electionId khi component được gắn kết
  useEffect(() => {
    const initializeElectionId = async () => {
      const id = await getElectionId();
      if (id) {
        setElectionId(id);
      } else {
        Alert.alert(
          "Lỗi",
          "Không tìm thấy ID cuộc bầu cử. Vui lòng chọn lại.",
          [{ text: "OK", onPress: () => router.push("/(admin)/electionList") }]
        );
      }
    };
    initializeElectionId();
  }, []);

  // Định nghĩa URL dựa trên electionId
  const RESULTS_API_URL = electionId
    ? `${BASE_API_URL}/election/${electionId}/results`
    : null;
  const ADD_CANDIDATE_API_URL = electionId
    ? `${BASE_API_URL}/election/${electionId}/candidate`
    : null;

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
    if (!RESULTS_API_URL) {
      console.error("RESULTS_API_URL is not defined");
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        Alert.alert(
          "Yêu cầu xác thực",
          "Không tìm thấy token xác thực. Vui lòng đăng nhập.",
          [{ text: "OK", onPress: () => router.push("/Login") }]
        );
        return;
      }

      console.log("Đang lấy danh sách ứng cử viên từ:", RESULTS_API_URL);
      console.log("Sử dụng token:", token);
      const response = await axios.get<ApiCandidate[]>(RESULTS_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API response (results):", response.data);
      const mappedCandidates = response.data.map(mapApiCandidateToCandidate);
      setCandidates(mappedCandidates);
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Không có ứng cử viên, đặt danh sách rỗng, không ghi log lỗi
        setCandidates([]);
      } else {
        console.error(
          "Lỗi khi lấy danh sách ứng cử viên:",
          error.message,
          error.response?.data,
          error.response?.status
        );
        if (error.response?.status === 401) {
          Alert.alert(
            "Không được phép",
            "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
            [{ text: "OK", onPress: () => router.push("/Login") }]
          );
        } else {
          Alert.alert(
            "Lỗi",
            `Không thể tải danh sách ứng cử viên: ${error.message}`
          );
        }
      }
    }
  };

  // Gọi fetchCandidates khi electionId thay đổi
  useEffect(() => {
    if (electionId) {
      fetchCandidates();
    }
  }, [electionId]);

  // Làm mới danh sách ứng cử viên
  const onRefresh = async () => {
    if (!RESULTS_API_URL) {
      console.error("RESULTS_API_URL is not defined");
      return;
    }

    setRefreshing(true);
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert(
          "Yêu cầu xác thực",
          "Không tìm thấy token xác thực. Vui lòng đăng nhập.",
          [{ text: "OK", onPress: () => router.push("/Login") }]
        );
        setRefreshing(false);
        return;
      }

      console.log("Đang làm mới danh sách ứng cử viên từ:", RESULTS_API_URL);
      const response = await axios.get<ApiCandidate[]>(RESULTS_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API response (làm mới):", response.data);
      const mappedCandidates = response.data.map(mapApiCandidateToCandidate);
      setCandidates(mappedCandidates);
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Không có ứng cử viên, đặt danh sách rỗng, không ghi log lỗi
        setCandidates([]);
      } else {
        console.error(
          "Lỗi khi làm mới danh sách ứng cử viên:",
          error.message,
          error.response?.data,
          error.response?.status
        );
        if (error.response?.status === 401) {
          Alert.alert(
            "Không được phép",
            "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
            [{ text: "OK", onPress: () => router.push("/Login") }]
          );
        } else {
          Alert.alert(
            "Lỗi",
            `Không thể làm mới danh sách ứng cử viên: ${error.message}`
          );
        }
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
          "Yêu cầu xác thực",
          "Không tìm thấy token xác thực. Vui lòng đăng nhập.",
          [{ text: "OK", onPress: () => router.push("/Login") }]
        );
        return;
      }

      console.log("Đang lấy danh sách ứng cử viên có sẵn từ:", CANDIDATE_API_URL);
      const response = await axios.get<ApiCandidateResponse>(CANDIDATE_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API response (candidates):", response.data);
      const mappedCandidates = response.data.data.map(
        mapApiAvailableCandidateToAvailableCandidate
      );

      const existingCandidateIds = candidates.map((c) => c.id);
      const preSelectedIds = mappedCandidates
        .filter((c) => existingCandidateIds.includes(c.id))
        .map((c) => c.id);

      setAvailableCandidates(mappedCandidates);
      setSelectedCandidateIds(preSelectedIds);
      setModalVisible(true);
    } catch (error: any) {
      console.error(
        "Lỗi khi lấy danh sách ứng cử viên có sẵn:",
        error.message,
        error.response?.data,
        error.response?.status
      );
      if (error.response?.status === 401) {
        Alert.alert(
          "Không được phép",
          "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
          [{ text: "OK", onPress: () => router.push("/Login") }]
        );
      } else {
        Alert.alert(
          "Lỗi",
          `Không thể tải danh sách ứng cử viên có sẵn: ${error.message}`
        );
      }
    }
  };

  // Thêm ứng cử viên vào cuộc bầu cử
  const addCandidatesToElection = async () => {
    if (!ADD_CANDIDATE_API_URL) {
      console.error("ADD_CANDIDATE_API_URL is not defined");
      return;
    }

    if (selectedCandidateIds.length === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn ít nhất một ứng cử viên.");
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        Alert.alert(
          "Yêu cầu xác thực",
          "Không tìm thấy token xác thực. Vui lòng đăng nhập.",
          [{ text: "OK", onPress: () => router.push("/Login") }]
        );
        return;
      }

      console.log("Đang thêm ứng cử viên vào cuộc bầu cử:", selectedCandidateIds);
      const response = await axios.put<{ success: boolean }>(
        ADD_CANDIDATE_API_URL,
        {
          candidateIds: selectedCandidateIds.map((id) => parseInt(id)),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Phản hồi thêm ứng cử viên:", response.data);
      if (response.data.success) {
        Alert.alert("Thành công", "Đã thêm ứng cử viên thành công.");
        setModalVisible(false);
        setSelectedCandidateIds([]);
        fetchCandidates();
      } else {
        Alert.alert("Lỗi", "Không thể thêm ứng cử viên.");
      }
    } catch (error: any) {
      console.error(
        "Lỗi khi thêm ứng cử viên:",
        error.message,
        error.response?.data,
        error.response?.status
      );
      if (error.response?.status === 401) {
        Alert.alert(
          "Không được phép",
          "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
          [{ text: "OK", onPress: () => router.push("/Login") }]
        );
      } else {
        Alert.alert("Lỗi", `Không thể thêm ứng cử viên: ${error.message}`);
      }
    }
  };

  // Xóa ứng cử viên
  const deleteCandidate = async (candidateId: string) => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert(
          "Yêu cầu xác thực",
          "Không tìm thấy token xác thực. Vui lòng đăng nhập.",
          [{ text: "OK", onPress: () => router.push("/Login") }]
        );
        return;
      }

      if (!candidateId || isNaN(parseInt(candidateId))) {
        Alert.alert("Lỗi", "ID ứng cử viên không hợp lệ.");
        return;
      }

      console.log(`Đang xóa ứng cử viên với ID: ${candidateId}`);
      const response = await axios.delete(
        `${DELETE_CANDIDATE_API_URL}/${candidateId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Phản hồi xóa ứng cử viên:", response.data);
      if (response.data.rowCount === 1) {
        Alert.alert("Thành công", "Đã xóa ứng cử viên thành công.");
        fetchCandidates();
      } else {
        Alert.alert(
          "Lỗi",
          "Không thể xóa ứng cử viên: Không có bản ghi nào được xóa."
        );
      }
    } catch (error: any) {
      console.error(
        "Lỗi khi xóa ứng cử viên:",
        error.message,
        error.response?.data,
        error.response?.status
      );
      if (error.response?.status === 401) {
        Alert.alert(
          "Không được phép",
          "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
          [{ text: "OK", onPress: () => router.push("/Login") }]
        );
      } else if (error.response?.status === 404) {
        Alert.alert("Lỗi", "Không tìm thấy ứng cử viên.");
      } else {
        Alert.alert("Lỗi", `Không thể xóa ứng cử viên: ${error.message}`);
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
    <View className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-md border border-gray-100">
      <Image
        source={{ uri: "https://via.placeholder.com/40" }}
        className="w-12 h-12 rounded-full mr-4"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
        <Text className="text-sm text-gray-600 mt-1">
          Email: <Text className="font-medium">{item.email}</Text>
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Mô tả: <Text className="font-medium">{item.description}</Text>
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Số phiếu: <Text className="font-medium">{item.voteCount}</Text>
        </Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          Alert.alert(
            "Xác nhận xóa",
            `Bạn có chắc muốn xóa ${item.name}?`,
            [
              { text: "Hủy", style: "cancel" },
              {
                text: "Xóa",
                onPress: () => deleteCandidate(item.id),
                style: "destructive",
              },
            ]
          )
        }
        className="p-2"
      >
        <Ionicons name="trash" size={24} color="#ff4444" />
      </TouchableOpacity>
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
      className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-md border border-gray-100"
    >
      <View
        className={`w-6 h-6 mr-4 border-2 rounded ${
          selectedCandidateIds.includes(item.id)
            ? "bg-violet-700 border-violet-700"
            : "bg-white border-gray-300"
        }`}
      >
        {selectedCandidateIds.includes(item.id) && (
          <Ionicons name="checkmark" size={18} color="white" />
        )}
      </View>
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
        <Text className="text-sm text-gray-600 mt-1">
          Email: <Text className="font-medium">{item.email}</Text>
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Mô tả: <Text className="font-medium">{item.description}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 p-5">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#1a3c5e" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-[#1a3c5e] ml-3">
            Rentaxo
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="menu" size={28} color="#1a3c5e" />
        </TouchableOpacity>
      </View>

      {/* Title và nút thêm ứng cử viên */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-semibold text-gray-800">
          Danh sách ứng cử viên
        </Text>
        <TouchableOpacity
          onPress={fetchAvailableCandidates}
          className="bg-violet-700 p-3 rounded-full shadow-md"
        >
          <Ionicons name="add-circle" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center bg-white p-4 rounded-xl mb-6 shadow-md border border-gray-100">
        <Ionicons name="search" size={22} color="#888" />
        <TextInput
          className="flex-1 mx-3 text-base text-gray-800"
          placeholder="Tìm kiếm tên"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Ionicons name="options" size={22} color="#888" />
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
          <View className="text-center mt-4">
            <Text className="text-center text-gray-500 text-base mb-4">
              Chưa có ứng cử viên nào
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Modal chọn ứng cử viên */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center p-5">
          <View className="bg-white rounded-2xl p-5 max-h-[80%] shadow-lg">
            <Text className="text-2xl font-semibold text-gray-800 mb-5">
              Chọn ứng cử viên
            </Text>
            <FlatList
              data={availableCandidates}
              keyExtractor={(item) => item.id}
              renderItem={renderAvailableCandidateItem}
              ListEmptyComponent={
                <Text className="text-center text-gray-500 text-base mt-4">
                  Không có ứng cử viên nào
                </Text>
              }
              showsVerticalScrollIndicator={false}
            />
            <View className="flex-row justify-end mt-5">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="px-5 py-3 mr-3"
              >
                <Text className="text-gray-600 text-base font-medium">Hủy</Text>
              </Pressable>
              <Pressable
                onPress={addCandidatesToElection}
                className="bg-violet-700 px-5 py-3 rounded-lg"
              >
                <Text className="text-white text-base font-medium">
                  Thêm đã chọn
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View className="mt-4">
        <BottomTabsAdmin />
      </View>
    </View>
  );
};

export default TenantListScreen;

