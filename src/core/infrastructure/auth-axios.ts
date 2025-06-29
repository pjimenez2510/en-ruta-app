// src/core/infrastructure/auth-axios.ts
import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";

export const createAuthApi = async (): Promise<AxiosInstance> => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Solo en el cliente
  if (typeof window !== "undefined") {
    const session = localStorage.getItem("token");

    if (session) {
      instance.interceptors.request.use((config) => {
        if (!config.headers["Authorization"]) {
          config.headers[
            "Authorization"
          ] = `Bearer ${session}`;
        }
        return config;
      });
    }

    instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const mensaje = error.response.data.message;
        const errors: string[] | string | undefined = error.response.data.error;
        toast.error(mensaje, { description: errors });
        return Promise.reject(error);
      }
    );
  }

  return instance;
};
