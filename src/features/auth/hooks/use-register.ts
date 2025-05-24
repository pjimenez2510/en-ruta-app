import { useState } from "react";
import { register as registerService } from "../services/auth.service";

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      await registerService({ name, email, password });
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
