import { create } from "zustand";
import { getUserRoleFromToken } from "../../services/jwt.utils";

interface AuthState {
  isAuthenticated: boolean;
  userRole?: string;
  login: (token?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userRole: undefined,
  login: (token?: string) => {
    let userRole;
    if (token) {
      userRole = getUserRoleFromToken(token);
    } else {
      const storedToken =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : undefined;
      if (storedToken) {
        userRole = getUserRoleFromToken(storedToken);
      }
    }
    set({ isAuthenticated: true, userRole });
  },
  logout: () => {
    localStorage.removeItem("token");
    document.cookie = "token=; Max-Age=0; path=/;";
    set({ isAuthenticated: false, userRole: undefined });
  },
}));
