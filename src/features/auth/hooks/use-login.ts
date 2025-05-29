"use client";
import { useState } from "react";
import { loginService } from "../services/auth.service";
import { setCookie } from "cookies-next";
import { useAuthStore } from "../presentation/context/auth.store";
import { useRouter } from "next/navigation";
import { LoginInput } from "../interfaces/auth.interface";
import { getUserRoleFromToken } from "../services/jwt.utils";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loginAuth = useAuthStore((state) => state.login);
  const router = useRouter();

  const login = async (input: LoginInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await loginService(input);
      localStorage.setItem("token", token);
      setCookie("token", token, { path: "/" }); // Guarda el token en cookies para el middleware
      const userRole = getUserRoleFromToken(token);
      loginAuth(token); // Actualiza el estado de autenticación y rol
      // Redirección basada en rol
      if (userRole === "PERSONAL_COOPERATIVA") {
        router.push("/main/dashboard");
      } else if (userRole === "ADMIN_SISTEMA") {
        router.push("/main/admin");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al iniciar sesión");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
