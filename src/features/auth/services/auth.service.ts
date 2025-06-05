import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";
import {
  LoginInput,
  RegisterCooperativaInput,
  RegisterInput,
} from "../interfaces/auth.interface";

interface ApiResponse {
  data: {
    accessToken: string;
    usuario: {
      id: number;
      username: string;
      tipoUsuario: string;
      fechaRegistro: string;
      ultimoAcceso: string | null;
      cliente: any | null;
      tenants: any[];
    };
  };
  message: string | null;
  error: string | null;
  statusCode: number;
}

export async function loginService(input: LoginInput): Promise<string> {
  const client = AxiosClient.getInstance();
  try {
    const baseURL = client.getUri();
    console.log("=== Login Service ===");
    console.log("URL base del cliente:", baseURL);
    console.log("URL completa:", `${baseURL}${API_ROUTES.AUTH.LOGIN}`);
    console.log("Credenciales:", { username: input.username, password: "***" });

    const response = await client.post<ApiResponse>(
      API_ROUTES.AUTH.LOGIN,
      input,
      {
        skipAuth: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("=== Respuesta del servidor ===");
    console.log("Status:", response.status);
    console.log("Data completa:", JSON.stringify(response.data, null, 2));

    // La respuesta tiene esta estructura: { data: { accessToken: string, ... } }
    const token = response.data?.data?.accessToken;
    if (!token) {
      console.error("No se encontró el token en la respuesta");
      throw new Error("La respuesta del servidor no contiene un token válido");
    }

    console.log("Token obtenido exitosamente");
    return token;
  } catch (error: any) {
    console.error("=== Error en loginService ===");
    console.error("Mensaje:", error.message);
    console.error("Status:", error.response?.status);
    console.error("Datos:", error.response?.data);
    throw error;
  }
}

export async function register(input: RegisterInput): Promise<void> {
  const client = AxiosClient.getInstance();
  await client.post(API_ROUTES.AUTH.REGISTER, input, { skipAuth: true });
}

export async function registerCooperativa(
  input: RegisterCooperativaInput
): Promise<void> {
  const client = AxiosClient.getInstance();
  await client.post(API_ROUTES.AUTH.REGISTER_COOPERATIVA, input, {
    skipAuth: true,
  });
}
