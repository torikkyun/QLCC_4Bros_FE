import axios from "axios";
// import { BACKEND_URL } from "@env";

const API_URL = "http://103.167.89.178:3000/api/auth/signin";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
}

export const login = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(API_URL, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 10000,
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Server responded with error status (4xx, 5xx)
      throw new Error(error.response.data.message || "Đăng nhập thất bại");
    } else if (error.request) {
      // No response received
      throw new Error("Không thể kết nối đến server");
    } else {
      // Other errors
      throw new Error("Lỗi khi thực hiện đăng nhập");
    }
  }
};
