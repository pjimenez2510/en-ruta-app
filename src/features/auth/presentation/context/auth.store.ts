import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => {
    localStorage.removeItem("token");
    document.cookie = "token=; Max-Age=0; path=/;";
    set({ isAuthenticated: false });
  },
}));
