import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

// JWT 토큰 만료 확인 함수
export const isTokenExpired = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));

    // exp는 초 단위로 저장됨, 현재 시간은 밀리초 단위
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    console.error("토큰 확인 오류:", e);
    return true; // 토큰 디코딩에 문제가 있으면 만료된 것으로 간주
  }
};

// 세션 만료 시 처리할 함수
export const handleSessionExpired = () => {
  // 현재 창의 경로를 저장
  const currentPath = window.location.pathname;
  
  // 알림 표시
  alert("세션이 만료되었습니다. 다시 로그인해주세요.");
  
  // 전역 상태에서 인증 정보 제거 
  const clearAuth = useAuthStore.getState().clearAuth;
  clearAuth();
  
  // 로그인 페이지로 리다이렉트
  if (currentPath !== '/login') {
    window.location.href = '/login';
  }
};

// 기본 API 인스턴스 설정
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // 요청 제한 시간 (5초)
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 설정
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // 토큰 가져오기
    
    if (token) {
      // 토큰 만료 확인
      if (isTokenExpired(token)) {
        handleSessionExpired();
        return Promise.reject(new axios.Cancel("Token expired"));
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API 요청 함수들
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
