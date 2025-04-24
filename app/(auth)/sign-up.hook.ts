import { useState } from "react";
import { useRouter } from "expo-router";
import { signUp } from "./sign-up.service";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

export const useSignUp = () => {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate email
    if (!form.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Validate password
    if (!form.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Validate confirm password
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    // Validate name
    if (!form.firstName.trim()) {
      newErrors.firstName = "Họ không được để trống";
    }
    if (!form.lastName.trim()) {
      newErrors.lastName = "Tên không được để trống";
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
      const { confirmPassword, ...submitData } = form;
      const response = await signUp(submitData);

      // Lưu token vào AsyncStorage nếu cần
      // await AsyncStorage.setItem('userToken', response.accessToken);

      // Chuyển hướng sau khi đăng ký thành công
      router.replace("../user/screen/home-user");
    } catch (error: any) {
      console.error("Sign up error:", error);
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    errors,
    isLoading,
    serverError,
    handleChange,
    handleSubmit,
  };
};
