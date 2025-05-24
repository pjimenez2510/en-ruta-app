"use client";
import { useState } from "react";
import { loginService } from "../services/auth.service";
import { setCookie } from "cookies-next";
import { useAuthStore } from "../presentation/context/auth.store";
import { useRouter } from "next/navigation";

interface LoginInput {
  email: string;
  password: string;
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loginAuth = useAuthStore(state => state.login);
  const router = useRouter();

  const login = async (input: LoginInput) => {
    setIsLoading(true);
    setError(null);
    try {      const token = await loginService(input);
      localStorage.setItem("token", token);
      setCookie("token", token, { path: "/" }); // Guarda el token en cookies para el middleware
      loginAuth(); // Actualiza el estado de autenticación
      router.push("/"); // Redirige al home
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
