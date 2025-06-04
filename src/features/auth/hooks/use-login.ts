"use client";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoginInput } from "../interfaces/auth.interface";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const login = async (input: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("=== Inicio del proceso de login ===");
      console.log("Credenciales a enviar:", {
        username: input.username,
        password: "***",
      });

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
        return;
      }

      console.log("✅ Login exitoso");
    } catch (err) {
      console.error("=== Error inesperado en login ===");
      console.error("Error completo:", err);
      setError("Error inesperado al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
