import { useAuthStore } from "@/stores/useAuthStore";
import { NavigateFunction, useNavigate } from "react-router-dom"

export function useLogout() {
    const navigate: NavigateFunction = useNavigate();

    return () => {
        useAuthStore.getState().clearAuth(); // Zustand 상태 초기화
        localStorage.removeItem("accessToken");
        navigate("/login");
    };
}