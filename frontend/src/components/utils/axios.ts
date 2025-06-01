import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "http://localhost:5000/api/v1" : "/api/v1",
  withCredentials: true,
});
