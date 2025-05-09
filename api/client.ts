import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG } from "./config";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor - thêm token vào header
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// // Response interceptor - xử lý refresh token khi token hết hạn
// apiClient.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     // Nếu lỗi 401 (Unauthorized) và chưa thử refresh token
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Lấy refresh token từ storage
//         const refreshToken = await AsyncStorage.getItem("refreshToken");

//         if (!refreshToken) {
//           // Nếu không có refresh token, đăng xuất người dùng
//           await AsyncStorage.removeItem("userToken");
//           await AsyncStorage.removeItem("refreshToken");
//           // Chuyển hướng đến trang đăng nhập (xử lý ở nơi khác)
//           return Promise.reject(error);
//         }

//         // Gọi API để lấy token mới
//         const response = await axios.post(
//           `${API_CONFIG.BASE_URL}/auth/refresh-token`,
//           { refreshToken }
//         );

//         // Lưu token mới
//         await AsyncStorage.setItem("userToken", response.data.accessToken);

//         // Cập nhật header và thử lại request
//         originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         // Nếu refresh token cũng hết hạn, đăng xuất người dùng
//         await AsyncStorage.removeItem("userToken");
//         await AsyncStorage.removeItem("refreshToken");
//         // Chuyển hướng đến trang đăng nhập (xử lý ở nơi khác)
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// Các phương thức API
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((response) => response.data),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then((response) => response.data),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then((response) => response.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((response) => response.data),
};

export default apiClient;
