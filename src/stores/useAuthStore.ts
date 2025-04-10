import { create } from "zustand";

type Member = {
  memberId: string;
  role: string;
  bizName: string;
};

type AuthStore = {
  member: Member | null;
  token: string | null;
  isHydrated: boolean;
  isAdmin: boolean;
  setMember: (member: Member) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => {
  const memberJson = localStorage.getItem("memberInfo");
  const token = localStorage.getItem("accessToken");
  let member: Member | null = null;

  try {
    member = memberJson ? JSON.parse(memberJson) : null;
  } catch (error) {
    console.error("Failed to parse member:", error);
  }

  return {
    member,
    token,
    isHydrated: true,
    isAdmin: member?.role === "admin",
    setMember: (member) => {
      localStorage.setItem("memberInfo", JSON.stringify(member));
      set({ member, isAdmin: member.role === "admin" });
    },
    setToken: (token) => {
      localStorage.setItem("accessToken", token);
      set({ token });
    },
    clearAuth: () => {
      localStorage.removeItem("memberInfo");
      localStorage.removeItem("accessToken");
      set({ member: null, token: null, isAdmin: false });
    },
  };
});
