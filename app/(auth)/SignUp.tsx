import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ImageBackground,
  Modal,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignUp } from "@/hooks/useSignUp";
import { Eye, EyeOff } from "lucide-react-native";

interface SignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface UseSignUpReturn {
  form: SignUpForm;
  errors: SignUpErrors;
  isLoading: boolean;
  serverError: string | null;
  handleChange: (field: keyof SignUpForm, value: string) => void;
  handleSubmit: () => Promise<void>;
  isSuccess?: boolean; // Giả định thêm để kiểm tra đăng ký thành công
}

export default function SignUpScreen() {
  const {
    form,
    errors,
    isLoading,
    serverError,
    handleChange,
    handleSubmit,
    isSuccess,
  } = useSignUp() as UseSignUpReturn;
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Hiển thị pop-up dựa trên trạng thái đăng ký
  useEffect(() => {
    if (isSuccess) {
      setShowSuccessModal(true);
    }
    if (serverError) {
      setShowErrorModal(true);
    }
  }, [isSuccess, serverError]);

  // Xử lý đóng pop-up và điều hướng
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.replace("./Login"); // Điều hướng về trang đăng nhập sau khi đăng ký thành công
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <ImageBackground
      source={require("@/assets/images/bgchungcu.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Title */}
        <Text style={styles.title}>Đăng ký</Text>
        <Text style={styles.subtitle}>Vui lòng điền thông tin</Text>

        {/* Server Error (Optional, since we have modal) */}
        {serverError && !showErrorModal && (
          <Text style={styles.errorText}>{serverError}</Text>
        )}

        {/* Firstname & Lastname */}
        <View style={styles.nameContainer}>
          <View style={styles.nameInputWrapper}>
            <TextInput
              style={[styles.input, errors.firstName ? styles.inputError : {}]}
              placeholder="Họ"
              placeholderTextColor="#999"
              value={form.firstName}
              onChangeText={(text) => handleChange("firstName", text)}
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}
          </View>
          <View style={styles.nameInputWrapper}>
            <TextInput
              style={[styles.input, errors.lastName ? styles.inputError : {}]}
              placeholder="Tên"
              placeholderTextColor="#999"
              value={form.lastName}
              onChangeText={(text) => handleChange("lastName", text)}
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.email ? styles.inputError : {}]}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(text) => handleChange("email", text)}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Password */}
        <View style={[styles.inputContainer, styles.passwordContainer]}>
          <TextInput
            style={[styles.input, errors.password ? styles.inputError : {}]}
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={form.password}
            onChangeText={(text) => handleChange("password", text)}
          />
          <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
            {showPassword ? (
              <Eye color="#666" size={20} />
            ) : (
              <EyeOff color="#666" size={20} />
            )}
          </TouchableOpacity>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        {/* Confirm Password */}
        <View style={[styles.inputContainer, styles.passwordContainer]}>
          <TextInput
            style={[
              styles.input,
              errors.confirmPassword ? styles.inputError : {},
            ]}
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor="#999"
            secureTextEntry={!showConfirmPassword}
            value={form.confirmPassword}
            onChangeText={(text) => handleChange("confirmPassword", text)}
          />
          <TouchableOpacity
            onPress={toggleShowConfirmPassword}
            style={styles.eyeIcon}
          >
            {showConfirmPassword ? (
              <Eye color="#666" size={20} />
            ) : (
              <EyeOff color="#666" size={20} />
            )}
          </TouchableOpacity>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Đăng ký</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.replace("./Login")}
        >
          <Text style={styles.loginLinkText}>Đã có tài khoản? Đăng nhập</Text>
        </TouchableOpacity>

        {/* Success Modal */}
        <Modal visible={showSuccessModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Đăng ký thành công!</Text>
              <Text style={styles.modalMessage}>
                Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để tiếp tục.
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleCloseSuccessModal}
              >
                <Text style={styles.modalButtonText}>Đi đến đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Error Modal */}
        <Modal visible={showErrorModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Đăng ký thất bại</Text>
              <Text style={styles.modalMessage}>{serverError}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleCloseErrorModal}
              >
                <Text style={styles.modalButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 160,
    paddingBottom: 80,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent for readability
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1e3a8a",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  nameInputWrapper: {
    width: "49%",
  },
  inputContainer: {
    marginBottom: 4,
  },
  passwordContainer: {
    position: "relative",
  },
  input: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#ef4444",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  submitButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  loginLink: {
    alignItems: "center",
  },
  loginLinkText: {
    textAlign: "center",
    fontSize: 14,
    color: "#4b5563",
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});
