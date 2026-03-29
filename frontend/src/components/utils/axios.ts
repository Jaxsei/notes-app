import axios from "axios";

const devUrl = "http://localhost:5000/api/v1";
const prodUrl = "/api/v1";

export const axiosInstance = axios.create({
  baseURL: devUrl,
  import.meta.env.MODE === "development"
   ? "http://localhost:5000/api/v1"
  : "/api/v1"
  withCredentials: true,
});

