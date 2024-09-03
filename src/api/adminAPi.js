// src/api/auth.js

import axiosInstance from "../axios/axiosInstance";

export const loginUser = async (email, password, fcmToken, rememberMe) => {
  try {
    console.log('working');
    const response = await axiosInstance.post("/login", {
      email,
      password,
      fcmToken,
      rememberMe,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyToken = async (token) => {
  try {
    const response = await axiosInstance.post("/verify-token", { token });
    return response.data;
  } catch (error) {
    throw error;
  }
};