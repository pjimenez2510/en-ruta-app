import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";
import { LoginInput, RegisterCooperativaInput, RegisterInput } from "../interfaces/auth.interface";

export async function loginService(input: LoginInput): Promise<string> {
  const client = AxiosClient.getInstance();
  const response = await client.post<{ token: string }>(
    API_ROUTES.AUTH.LOGIN,
    input,
    { skipAuth: true }
  );
  return response.data.data.token;
}

export async function register(input: RegisterInput): Promise<void> {
  const client = AxiosClient.getInstance();
  await client.post(
    API_ROUTES.AUTH.REGISTER,
    input,
    { skipAuth: true }
  );
}

export async function registerCooperativa(input: RegisterCooperativaInput): Promise<void> {
  const client = AxiosClient.getInstance();
  await client.post(
    API_ROUTES.AUTH.REGISTER_COOPERATIVA,
    input,
    { skipAuth: true }
  );
}
