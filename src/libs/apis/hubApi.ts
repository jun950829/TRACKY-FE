import { EngineRequestType } from "@/constants/mocks/mockData";
import { CycleInfoRequest } from "@/constants/types/types";
import axios from "axios";
import { isTokenExpired, handleSessionExpired } from "./api";

// 성능 문제 방지를 위한 API 설정
const hubApi = axios.create({
  baseURL: import.meta.env.VITE_HUB_API_HOST,
  timeout: 10000, // 타임아웃 10초로 증가 (더 안정적인 요청 처리를 위해)
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 추가
hubApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    
    if (token) {
      // 토큰 만료 확인
      if (isTokenExpired(token)) {
        handleSessionExpired();
        return Promise.reject(new axios.Cancel("Token expired"));
      }
      
      // 토큰 추가
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export const hubApiService = {
  // 주기정보 전송 API
  sendCycleInfo: async (cycleInfoRequest: CycleInfoRequest) => {
    const response = await hubApi.post("/car/cycle", cycleInfoRequest);
    return response.data;
  },
  
  // 시동 ON API
  sendEngineOn: async (engineRequest: EngineRequestType) => {
    const response = await hubApi.post("/car/on", engineRequest);
    return response.data;
  },
  
  // 시동 OFF API
  sendEngineOff: async (engineRequest: EngineRequestType) => {
    const response = await hubApi.post("/car/off", engineRequest);
    return response.data;
  }
};
