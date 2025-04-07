import axios from "axios";
import api from "./api";

const loginApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/login",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    }
});

// 응답 인터셉터 설정
loginApi.interceptors.response.use(
    (response) => response,
    (error) => {        
        console.error("API Error:", error.response || error.message);
        return Promise.reject(error);
    }
);

export const loginApiService = {
    login: async (data: {memberId: string, pwd: string}) => {
        const response = await api.post("/login", data);
        return response.data;
    }
};

export default loginApiService;