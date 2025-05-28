import { useState } from "react";
import { register as registerService } from "../services/auth.service";
import { RegisterInput } from "../interfaces/auth.interface";

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (input: RegisterInput) => {
    setIsLoading(true);
    setError(null);
    try {
      await registerService(input);
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
