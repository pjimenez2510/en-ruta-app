"use client";
import { useState } from "react";
import {
  register as registerService,
  loginService,
} from "../services/auth.service";
import { RegisterInput } from "../interfaces/auth.interface";
import { setCookie } from "cookies-next";
import { useAuthStore } from "../presentation/context/auth.store";
import { useRouter } from "next/navigation";
import { getUserRoleFromToken } from "../services/jwt.utils";

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loginAuth = useAuthStore((state) => state.login);
  const router = useRouter();

  const register = async (input: RegisterInput) => {
    setIsLoading(true);
    setError(null);
    try {
      await registerService(input);

      const token = await loginService({
        username: input.username,
        password: input.password,
      });
      localStorage.setItem("token", token);
      setCookie("token", token, { path: "/" });
      const userRole = getUserRoleFromToken(token);
      loginAuth(token); // Actualiza el estado de autenticación y rol
      // Redirección basada en rol
      if (userRole === "PERSONAL_COOPERATIVA") {
        router.push("/main/dashboard");
      } else if (userRole === "ADMIN_SISTEMA") {
        router.push("/main/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al registrar");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}
