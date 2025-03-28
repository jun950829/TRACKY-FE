import axios from "axios";

// ✅ 기본 API 인스턴스 설정
const loginApi = axios.create({
  // baseURL: "/signup",
  baseURL: "http://localhost:8080",
  timeout: 5000, // 요청 제한 시간 (5초)
  headers: {
    "Content-Type": "application/json",
    withCredentials: true
  },
});

// // ✅ 요청 인터셉터 설정 (필요한 경우)
// loginApi.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken"); // 토큰 가져오기 (예제)
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// ✅ 응답 인터셉터 설정 (에러 핸들링)
loginApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

// ✅ API 요청 함수들
export const loginApiService = {
  login: async (data: { memberId: string, password: string}) => {
    console.log(loginApi);
    const response = await loginApi.post("/login", data);
    return response.data;
  },
};

export default loginApiService;