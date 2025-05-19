"use client";
import { useState } from "react";
import { loginService } from "../services/auth.service";
import { setCookie } from "cookies-next";

interface LoginInput {
  email: string;
  password: string;
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (input: LoginInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await loginService(input);
      localStorage.setItem("token", token);
      setCookie("token", token, { path: "/" }); // Guarda el token en cookies para el middleware
      // Aquí puedes redirigir o actualizar el estado global
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
