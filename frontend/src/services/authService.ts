import axios from "axios";

const API_BASE_URL = "http://localhost:5133/api/Auth";

export interface LoginRequest {
  email: string;
  identifier?: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  requiresOtp: boolean;
  message: string;
}

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_BASE_URL}/login`, data);
  return response.data;
};

export const registerUser = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_BASE_URL}/register`, data);
  return response.data;
};

export interface ForgotPasswordRequest {
  identifier: string;
}

export interface VerifyResetOtpRequest {
  identifier: string;
  otp: string;
}

export interface VerifyResetOtpResponse {
  resetToken: string;
  message: string;
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
}

export const forgotPassword = async (identifier: string): Promise<{ message: string }> => {
  const response = await axios.post<{ message: string }>(`${API_BASE_URL}/forgot-password`, { identifier });
  return response.data;
};

export const verifyResetOtp = async (identifier: string, otp: string): Promise<VerifyResetOtpResponse> => {
  const response = await axios.post<VerifyResetOtpResponse>(`${API_BASE_URL}/verify-reset-otp`, { identifier, otp });
  return response.data;
};

export const resetPassword = async (resetToken: string, newPassword: string): Promise<{ message: string }> => {
  const response = await axios.post<{ message: string }>(`${API_BASE_URL}/reset-password`, { resetToken, newPassword });
  return response.data;
};

