import axios from "axios";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api/user",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getUserProfile = async (id) => {
  try {
    console.log(id);
    const res = await API.get(`/${id}`);
    return res.data;
  } catch (error) {
    toast.error("Failed to load profile");
    throw error;
  }
};

export const updateAbout = async (about) => {
  try {
    const res = await API.put("/update-profile", { about });
    toast.success("Profile updated ✨");
    return res.data;
  } catch (error) {
    toast.error("Failed to update profile");
    throw error;
  }
};

export const addEducation = async (data) => {
  try {
    const res = await API.post("/education", data);
    toast.success("Education added 🎓");
    return res.data;
  } catch (error) {
    toast.error("Failed to add education");
    throw error;
  }
};

export const deleteEducation = async (eduId) => {
  try {
    const res = await API.delete(`/education/${eduId}`);
    toast.success("Education removed 🗑️");
    return res.data;
  } catch (error) {
    toast.error("Failed to delete education");
    throw error;
  }
};

export const addWorkExperience = async (data) => {
  try {
    const res = await API.post("/work-experience ", data);
    toast.success("Work experience added 💼");
    return res.data;
  } catch (error) {
    toast.error("Failed to add work experience");
    throw error;
  }
};

export const deleteWorkExperience = async (workId) => {
  try {
    const res = await API.delete(`/work-experience/${workId}`);
    toast.success("Work experience removed 🗑️");
    return res.data;
  } catch (error) {
    toast.error("Failed to delete work experience");
    throw error;
  }
};

export const updateSkills = async (data) => {
  try {
    const res = await API.put("/update-skills", data);
    toast.success(res.data.message || "Skills updated ⚡");
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update skills");
    throw error;
  }
};

export const sendConnectionRequest = async (targetUserId) => {
  try {
    const res = await API.post("/connect", { targetUserId });
    toast.success("Connection request sent 🤝");
    return res.data;
  } catch (error) {
    toast.error("Failed to send request");
    throw error;
  }
};
export const approveConnectionRequest = async (requesterId) => {
  try {
    const res = await API.post("/approve", { requesterId });
    toast.success("Connection approved ✅");
    return res.data;
  } catch (error) {
    toast.error("Failed to approve request");
    throw error;
  }
};
export const getPendingRequests = async () => {
  try {
    const res = await API.get("/connections/pending");
    return res.data;
  } catch (error) {
    toast.error("Failed to load requests");
    throw error;
  }
};
export const removeConnection = async (targetUserId) => {
  try {
    const res = await API.post("/remove", { targetUserId });
    toast.success("Connection removed ❌");
    return res.data;
  } catch (error) {
    toast.error("Failed to remove connection");
    throw error;
  }
};

