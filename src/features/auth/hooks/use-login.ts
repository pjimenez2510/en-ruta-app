"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { LoginInput } from "../interfaces/auth.interface";
import { useAuthStore } from "../presentation/context/auth.store";
import { loginService } from "../services/auth.service";
import { isAxiosError } from "axios";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setToken } = useAuthStore();

  const login = async (input: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("=== Inicio del proceso de login ===");
      console.log("Credenciales a enviar:", {
        username: input.username,
        password: "***",
      });

      // Primero, obtener el token del servicio backend
      const token = await loginService(input);

      // Guardar el token en localStorage y en el store
      if (token) {
        localStorage.setItem("token", token);
        setToken(token);
        console.log("✅ Token guardado exitosamente");
      } else {
        throw new Error("No se recibió un token válido");
      }

      // Luego, iniciar sesión en NextAuth para manejar el estado de la sesión
      const result = await signIn("credentials", {
        username: input.username,
        password: input.password,
        redirect: false,
      });

      console.log("=== Resultado del login ===");
      console.log("Resultado completo:", result);

      if (!result?.ok) {
        console.error("Error de login:", result?.error);
        setError(result?.error || "Error al iniciar sesión");
        localStorage.removeItem("token");
        setToken(null);
        return;
      }

      console.log("✅ Login exitoso");
      // La redirección será manejada por el middleware
    } catch (err) {
      console.error("=== Error inesperado en login ===");
      console.error("Error completo:", err);

      let errorMessage = "Error inesperado al iniciar sesión";
      if (isAxiosError(err)) {
        errorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Ocurrió un error en el servidor.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
