import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";
import {
  LoginInput,
  RegisterCooperativaInput,
  RegisterInput,
} from "../interfaces/auth.interface";
import { isAxiosError } from "axios";

interface Cliente {
  id: number;
  nombre: string;
  // Agrega aquí más propiedades según la estructura real del cliente
}

interface InfoPersonal {
  id: number;
  nombre: string;
  apellido: string;
  // Agrega aquí más propiedades según la estructura real de la información personal
}

interface LoginResponse {
  accessToken: string;
  usuario: {
    id: number;
    username: string;
    tipoUsuario: string;
    fechaRegistro: string;
    ultimoAcceso: string | null;
    activo: boolean;
    cliente: Cliente | null;
    tenants: Array<{
      id: number;
      fechaAsignacion: string;
      tenantId: number;
      rol: string;
      activo: boolean;
      tenant: {
        id: number;
        nombre: string;
        identificador: string;
        logoUrl: string;
        colorPrimario: string;
        colorSecundario: string;
        sitioWeb: string;
        emailContacto: string;
        telefono: string;
      };
      infoPersonal: InfoPersonal | null;
    }>;
  };
}

export async function loginService(input: LoginInput): Promise<string> {
  const client = AxiosClient.getInstance();
  try {
    console.log("=== Login Service ===");
    console.log("URL de login:", API_ROUTES.AUTH.LOGIN);
    console.log("Credenciales:", { username: input.username, password: "***" });

    const response = await client.post<LoginResponse>(
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

    const token = response.data.data.accessToken;
    if (!token) {
      console.error("No se encontró el token en la respuesta");
      throw new Error("La respuesta del servidor no contiene un token válido");
    }

    console.log("Token obtenido exitosamente");
    return token;
  } catch (error) {
    console.error("=== Error en loginService ===");
    if (isAxiosError(error)) {
      const errorData = error.response?.data || error.message;
      console.error("Detalles del error:", errorData);
    } else {
      console.error("Error no relacionado con Axios:", error);
    }
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
