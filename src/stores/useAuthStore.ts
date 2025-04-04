import { create } from "zustand";

type Member = {
    memberId: string;
    role: string;
    bizName: string;
  };
  
  type AuthStore = {
    member: Member | null;
    token: string | null;
    setMember: (member: Member) => void;
    setToken: (token: string) => void;
    clearAuth: () => void;
  };
  
  export const useAuthStore = create<AuthStore>((set) => ({
    member: null,
    token: null,
    setMember: (member) => set({ member }),
    setToken: (token) => set({ token }),
    clearAuth: () => set({ member: null, token: null }),
  }));