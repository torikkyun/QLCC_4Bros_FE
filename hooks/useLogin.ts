import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { login } from "@/api/services/login.service";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface JwtPayload {
  user_id: number;
  email: string;
  role: "manager" | "user";
  iat: number;
  exp: number;
}

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export const useLogin = () => {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Xóa token khi màn hình đăng nhập được tải
  useEffect(() => {
    const clearToken = async () => {
      try {
        await AsyncStorage.removeItem("userToken");
        console.log("Token cleared on app start");
      } catch (error) {
        console.error("Error clearing token:", error);
      }
    };
    clearToken();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!form.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Clear error when typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (serverError) setServerError(null);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setServerError(null);

    try {
      const response = await login(form);

      // Giải mã accessToken
      const decoded: JwtPayload = jwtDecode(response.accessToken);

      // Lưu token mới
      await AsyncStorage.setItem("userToken", response.accessToken);

      // Điều hướng theo vai trò
      if (decoded.role === "manager") {
        router.replace("/(admin)/home-admin");
      } else if (decoded.role === "user") {
        router.replace("/(user)/HomeUser");
      } else {
        setServerError("Không xác định được vai trò người dùng");
        await AsyncStorage.removeItem("userToken"); // Xóa token nếu vai trò không hợp lệ
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setServerError(error.message || "Lỗi đăng nhập");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return {
    form,
    errors,
    isLoading,
    serverError,
    showPassword,
    handleChange,
    handleSubmit,
    toggleShowPassword,
  };
};
