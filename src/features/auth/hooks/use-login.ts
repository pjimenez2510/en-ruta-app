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
      const result = await signIn("credentials", {
        username: input.username,
        password: input.password,
        redirect: false,
      });

      if (!result?.ok) {
        setError(result?.error || "Error al iniciar sesión");
        return;
      }

      // Redirección basada en rol
      if (session?.user?.role === "PERSONAL_COOPERATIVA") {
        router.push("/main/dashboard");
      } else if (session?.user?.role === "ADMIN_SISTEMA") {
        router.push("/main/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Error inesperado al iniciar sesión");
      console.error("Error de autenticación:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
