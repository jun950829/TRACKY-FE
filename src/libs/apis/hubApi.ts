import { EngineRequestType } from "@/constants/mocks/mockData";
import { CycleInfoRequest } from "@/constants/types";
import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";

// metadata 속성을 포함하는 확장 타입 정의
interface RequestConfigWithMetadata extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}

// 성능 문제 방지를 위한 API 설정
const hubApi = axios.create({
  baseURL: import.meta.env.VITE_HUB_API_HOST,
  timeout: 10000, // 타임아웃 10초로 증가 (더 안정적인 요청 처리를 위해)
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 추가 (성능 측정 및 안정성 향상)
hubApi.interceptors.request.use((config: InternalAxiosRequestConfig): RequestConfigWithMetadata => {
  // 요청 시간 기록 (성능 측정용)
  const configWithMetadata = config as RequestConfigWithMetadata;
  configWithMetadata.metadata = { startTime: new Date() };
  return configWithMetadata;
});

// 응답 인터셉터 추가 (성능 측정 및 로깅)
hubApi.interceptors.response.use(
  (response: AxiosResponse) => {
    // 요청 처리 시간 계산
    const config = response.config as RequestConfigWithMetadata;
    const startTime = config.metadata?.startTime;
    if (startTime) {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      // 지연된 응답 경고 (1초 이상 소요된 경우)
      if (duration > 1000) {
        console.warn(`⚠️ API 요청 지연 감지: ${duration}ms 소요 (${response.config.url})`);
      }
    }
    return response;
  },
  (error) => {
    // 네트워크 오류나 타임아웃 등에 대한 자세한 정보 로깅
    if (error.response) {
      // 서버가 응답을 반환했지만 오류 코드 (4xx, 5xx)
      console.error(`❌ API 오류 (${error.response.status}): ${error.response.data?.message || '서버 오류'}`);
    } else if (error.request) {
      // 요청은 이루어졌지만 응답이 없음 (타임아웃 등)
      console.error(`❌ API 응답 없음 (타임아웃): ${error.request._url || '알 수 없는 URL'}`);
    } else {
      // 요청 구성 중 오류
      console.error(`❌ API 요청 구성 오류: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export const hubApiService = {
  // 주기정보 전송 API
  sendCycleInfo: async (cycleInfoRequest: CycleInfoRequest) => {
    console.log("주기정보 전송 URL:", import.meta.env.VITE_HUB_API_HOST + "/car/cycle");
    const response = await hubApi.post("/car/cycle", cycleInfoRequest);
    return response.data;
  },
  
  // 시동 ON API
  sendEngineOn: async (engineRequest: EngineRequestType) => {
    console.log("시동 ON 전송 URL:", import.meta.env.VITE_HUB_API_HOST + "/car/on");
    const response = await hubApi.post("/car/on", engineRequest);
    return response.data;
  },
  
  // 시동 OFF API
  sendEngineOff: async (engineRequest: EngineRequestType) => {
    console.log("시동 OFF 전송 URL:", import.meta.env.VITE_HUB_API_HOST + "/car/off");
    const response = await hubApi.post("/car/off", engineRequest);
    return response.data;
  }
};
