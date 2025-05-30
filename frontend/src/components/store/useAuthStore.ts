import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";

// code taken from burakormez from fullstack-chatapp

interface Otp {
  code: string;
  expiresAt: Date;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  isVerified: string;
  otp?: Otp;
}

// Types for signup, login, etc.
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends Omit<User, "_id" | "isVerified" | "otp"> { }

export interface ProfileUpdateData extends Partial<Omit<User, "_id">> { }

export interface OtpData {
  email: string;
  otp: string;
}

export interface AuthState {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isVerifyingOtp: boolean;
  isSendingOtp: boolean;
  isCheckingAuth: boolean;

  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  verifyOtp: (data: OtpData) => Promise<void>;
  sendOtp: (data: { email: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isVerifyingOtp: false,
  isSendingOtp: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get<User>("/auth/check");
      set({ authUser: res.data });
    } catch (error: any) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: SignupData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post<User>("/auth/signup", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: AuthCredentials) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post<User>("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data: ProfileUpdateData) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put<User>("/auth/update-profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  verifyOtp: async (data: OtpData) => {
    set({ isVerifyingOtp: true });
    try {
      const res = await axiosInstance.post<User>("/auth/verifyotp", data);
      set({ authUser: res.data });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Verifying OTP failed");
    } finally {
      set({ isVerifyingOtp: false });
    }
  },

  sendOtp: async ({ email }: { email: string }) => {
    set({ isSendingOtp: true });
    try {
      const res = await axiosInstance.post<User>("/auth/sendotp", { email });
      set({ authUser: res.data });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Sending OTP failed");
    } finally {
      set({ isSendingOtp: false });
    }
  }
}));
