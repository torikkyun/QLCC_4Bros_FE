import axios from "axios";

const API_URL = "http://103.167.89.178:3000/api/auth/signup";

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface SignUpResponse {
  accessToken: string;
}

export const signUp = async (data: SignUpData): Promise<SignUpResponse> => {
  try {
    const response = await axios.post<SignUpResponse>(API_URL, data, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10 giây timeout
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Lỗi từ phía server (4xx, 5xx)
      throw new Error(error.response.data.message || "Đăng ký thất bại");
    } else if (error.request) {
      // Không nhận được phản hồi từ server
      throw new Error("Không thể kết nối đến server");
    } else {
      // Lỗi khác
      throw new Error("Có lỗi xảy ra khi đăng ký");
    }
  }
};
