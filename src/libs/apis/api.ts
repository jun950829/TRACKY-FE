import axios from "axios";

// ✅ 기본 API 인스턴스 설정
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://jsonplaceholder.typicode.com", // 기본 API URL
  timeout: 5000, // 요청 제한 시간 (5초)
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청 인터셉터 설정 (필요한 경우)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // 토큰 가져오기 (예제)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터 설정 (에러 핸들링)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

// ✅ API 요청 함수들
export const apiService = {
  getUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: { name: string; email: string }) => {
    const response = await api.post("/users", data);
    return response.data;
  },

  updateUser: async (id: number, data: { name?: string; email?: string }) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default api;
