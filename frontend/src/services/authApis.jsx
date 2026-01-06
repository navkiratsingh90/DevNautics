import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * ===================== AUTH APIS =====================
 */

export const registerUser = async (data) => {
  try {
    const res = await API.post("/auth/register", data);
    toast.success(res.data.msg);
    return res;
  } catch (err) {
    toast.error(err.response?.data?.msg || "Registration failed");
    throw err;
  }
};

export const verifyUser = async (data) => {
  try {
    const res = await API.post("/auth/verify", data);
    toast.success(res.data.msg);
    return res;
  } catch (err) {
    toast.error(err.response?.data?.msg || "Verification failed");
    throw err;
  }
};
export const getUser = async () => {
  try {
    const res = await API.get("/auth/get-user");
    toast.success(res.data.msg);
    return res;
  } catch (err) {
    toast.error(err.response?.data?.msg || "Verification failed");
    throw err;
  }
};

export const loginUser = async (data) => {
  try {
    const res = await API.post("/auth/login", data);
    toast.success(res.data);
    return res;
  } catch (err) {
    toast.error(err.response?.data?.msg || "Login failed");
    throw err;
  }
};

export const logoutUser = async () => {
  try {
    const res = await API.post("/auth/logout");
    toast.success(res.data.msg);
    return res;
  } catch (err) {
    toast.error("Logout failed");
    throw err;
  }
};

export const forgotPassword = async (data) => {
  try {
    const res = await API.post("/auth/forgot-password", data);
    toast.success(res.data.msg);
    return res;
  } catch (err) {
    toast.error(err.response?.data?.msg || "Failed to send OTP");
    throw err;
  }
};

export const resetPassword = async (data) => {
  try {
    const res = await API.post("/auth/reset-password", data);
    toast.success(res.data.msg);
    return res;
  } catch (err) {
    toast.error(err.response?.data?.msg || "Password reset failed");
    throw err;
  }
};

export default API;
