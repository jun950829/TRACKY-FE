import { useAuthStore } from "@/stores/useAuthStore";
import { NavigateFunction, useNavigate } from "react-router-dom"

export function useLogout() {
    const navigate: NavigateFunction = useNavigate();

    return () => {
        useAuthStore.getState().clearAuth(); // 로그인 정보 초기화
        localStorage.removeItem("accessToken");
        navigate("/login");
    };
}
