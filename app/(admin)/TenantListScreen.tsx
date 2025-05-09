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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomTabsAdmin from "@/components/BottomTabsAdmin";

// Định nghĩa kiểu cho user trong API
interface ApiUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

// Định nghĩa kiểu cho mỗi item trong data
interface ApiTenant {
  id: number;
  description: string;
  user: ApiUser;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiResponse {
  data: ApiTenant[];
  pagination: Pagination;
}

// Định nghĩa kiểu cho tenant hiển thị trên giao diện
interface Tenant {
  id: string;
  name: string;
  score: number;
  email: string;
  description: string;
}

const TenantListScreen: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // API base URL
  const API_BASE_URL = "http://103.167.89.178:3000/api/candidate";

  // Hàm lấy token từ AsyncStorage
  const getToken = async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      return token;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  };

  // Ánh xạ dữ liệu từ API thành Tenant
  const mapApiTenantToTenant = (apiTenant: ApiTenant): Tenant => ({
    id: apiTenant.id.toString(),
    name: `${apiTenant.user.firstName} ${apiTenant.user.lastName}`,
    score: 0, // API không có trường score, đặt mặc định là 0
    email: apiTenant.user.email,
    description: apiTenant.description,
  });

  // Gọi API để lấy danh sách tenants
  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Error", "No authentication token found. Please log in.");
        return;
      }

      const response = await axios.get<ApiResponse>(
        `${API_BASE_URL}?page=1&limit=10&order=desc`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const mappedTenants = response.data.data.map(mapApiTenantToTenant);
      setTenants(mappedTenants);
    } catch (error: any) {
      console.error("Error fetching tenants:", error.message);
      if (error.response?.status === 401) {
        Alert.alert("Unauthorized", "Invalid token. Please log in again.");
      } else {
        Alert.alert("Error", "Failed to load tenants. Please try again.");
      }
      // Dữ liệu mặc định nếu API lỗi
      setTenants([
        {
          id: "1",
          name: "Nir Bahadur",
          score: 69,
          email: "nir@example.com",
          description: "This is a description",
        },
        {
          id: "2",
          name: "Nir Bahadur",
          score: 9,
          email: "nir2@example.com",
          description: "This is a description",
        },
        {
          id: "3",
          name: "Elon Musk",
          score: 99,
          email: "elon@example.com",
          description: "This is a description",
        },
      ]);
    }
  };

  // Làm mới dữ liệu từ API
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Error", "No authentication token found. Please log in.");
        setRefreshing(false);
        return;
      }

      const response = await axios.get<ApiResponse>(
        `${API_BASE_URL}?page=1&limit=10&order=desc`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const mappedTenants = response.data.data.map(mapApiTenantToTenant);
      setTenants(mappedTenants);
    } catch (error: any) {
      console.error("Error refreshing tenants:", error.message);
      if (error.response?.status === 401) {
        Alert.alert("Unauthorized", "Invalid token. Please log in again.");
      } else {
        Alert.alert("Error", "Failed to refresh tenants. Please try again.");
      }
    } finally {
      setRefreshing(false);
    }
  };

  // Search Tenants
  const filteredTenants = tenants.filter((tenant) =>
    tenant.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Add Tenant (Gọi API để thêm tenant)
  const addTenant = async () => {
    const newTenant = {
      description: "This is a new tenant",
      user: {
        email: `newtenant${tenants.length + 1}@example.com`,
        firstName: "New",
        lastName: "Tenant",
      },
    };

    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Error", "No authentication token found. Please log in.");
        return;
      }

      const response = await axios.post<ApiTenant>(API_BASE_URL, newTenant, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const mappedTenant = mapApiTenantToTenant(response.data);
      setTenants([mappedTenant, ...tenants]);
    } catch (error: any) {
      console.error("Error adding tenant:", error.message);
      if (error.response?.status === 401) {
        Alert.alert("Unauthorized", "Invalid token. Please log in again.");
      } else {
        Alert.alert("Error", "Failed to add tenant. Please try again.");
      }
    }
  };

  // Delete Tenant (Gọi API để xóa tenant)
  const deleteTenant = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Error", "No authentication token found. Please log in.");
        return;
      }

      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTenants(tenants.filter((tenant) => tenant.id !== id));
    } catch (error: any) {
      console.error("Error deleting tenant:", error.message);
      if (error.response?.status === 401) {
        Alert.alert("Unauthorized", "Invalid token. Please log in again.");
      } else {
        Alert.alert("Error", "Failed to delete tenant. Please try again.");
      }
    }
  };

  // Edit Tenant (Gọi API để chỉnh sửa tenant)
  const editTenant = async (id: string, currentName: string) => {
    Alert.prompt(
      "Edit Tenant Name",
      "Enter new name (format: FirstName LastName):",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async (newName: string | undefined) => {
            if (newName) {
              try {
                const token = await getToken();
                if (!token) {
                  Alert.alert(
                    "Error",
                    "No authentication token found. Please log in."
                  );
                  return;
                }

                const [firstName, lastName] = newName.split(" ");
                if (!firstName || !lastName) {
                  Alert.alert(
                    "Error",
                    "Please enter both first and last name."
                  );
                  return;
                }

                // API này có thể yêu cầu cập nhật user, nhưng endpoint có thể khác
                // Giả định API cho phép cập nhật trực tiếp user qua tenant
                await axios.put(
                  `${API_BASE_URL}/${id}`,
                  {
                    user: { firstName, lastName },
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                setTenants(
                  tenants.map((tenant) =>
                    tenant.id === id ? { ...tenant, name: newName } : tenant
                  )
                );
              } catch (error: any) {
                console.error("Error editing tenant:", error.message);
                if (error.response?.status === 401) {
                  Alert.alert(
                    "Unauthorized",
                    "Invalid token. Please log in again."
                  );
                } else {
                  Alert.alert(
                    "Error",
                    "Failed to edit tenant. Please try again."
                  );
                }
              }
            }
          },
        },
      ],
      "plain-text",
      currentName
    );
  };

  // Render item cho FlatList
  const renderItem = ({ item }: { item: Tenant }) => (
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
      </View>
      <View className="items-end">
        {/* Todo */}
        <Text className="text-xs text-gray-500 mb-1">{item.time}</Text>
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => deleteTenant(item.id)}
            className="mr-3"
          >
            <Ionicons name="trash" size={20} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => editTenant(item.id, item.name)}>
            <Ionicons name="pencil" size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
      {/* Title */}
      <Text className="text-xl font-semibold mb-4">Tenant List</Text>
      {/* Search Bar */}
      <View className="flex-row items-center bg-[#e6f0fa] p-3 rounded-2xl mb-4">
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          className="flex-1 mx-2 text-base"
          placeholder="Search address, city, location"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Ionicons name="options" size={20} color="#888" />
      </View>
      {/* Tenant List */}
      <FlatList
        data={filteredTenants}
        keyExtractor={(item: Tenant) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {/* Bottom Navigation */}
      <BottomTabsAdmin addTenant={addTenant} /> {/* Todo */}
    </View>
  );
};

export default TenantListScreen;
