import { useState, useEffect } from "react";
import { usersService } from "@/api/services/users.service";

export const useRegisterCandidate = () => {
  const [fullName, setFullName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response: any = await usersService.getMe();
        setFullName(`${response.firstName} ${response.lastName}`);
        setError(null);
      } catch (err) {
        setError("Không thể lấy thông tin người dùng");
        console.error("Lỗi khi lấy thông tin người dùng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return {
    fullName,
    loading,
    error,
  };
};
