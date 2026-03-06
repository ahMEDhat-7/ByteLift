import axios, { type AxiosProgressEvent } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const uploadFile = (
  file: File,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: onProgress,
  });
};

export const getFiles = () => api.get("/files/all");

export const getFile = (id: number) =>
  api.get(`/files/${id}`, { responseType: "blob" });

export const deleteFile = (id: number) => api.delete(`/files/${id}`);

export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

export const signup = (email: string, password: string, username: string) =>
  api.post("/auth/signup", { email, password, username });

export default api;
