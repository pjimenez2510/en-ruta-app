import { create } from "zustand";
import { getUserRoleFromToken } from "../../services/jwt.utils";

interface AuthState {
  isAuthenticated: boolean;
  userRole?: string;
  token: string | null;
  login: (token?: string) => void;
  logout: () => void;
  setUserRole: (role: string) => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userRole: undefined,
  token: null,

  login: (token?: string) => {
    let userRole;
    if (token) {
      userRole = getUserRoleFromToken(token);
      localStorage.setItem("token", token);
      set({ token });
    } else {
      const storedToken =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : undefined;
      if (storedToken) {
        userRole = getUserRoleFromToken(storedToken);
        set({ token: storedToken });
      }
    }
    set({ isAuthenticated: true, userRole });
  },

  logout: () => {
    localStorage.removeItem("token");
    document.cookie = "token=; Max-Age=0; path=/;";
    set({ isAuthenticated: false, userRole: undefined, token: null });
  },

  setUserRole: (role: string) => set({ userRole: role }),
  
  setToken: (token: string | null) => {
    set({ token });
    if (token) {
      const userRole = getUserRoleFromToken(token);
      set({ isAuthenticated: true, userRole });
    }
  },
}));
