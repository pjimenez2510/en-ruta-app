import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";

interface LoginInput {
  email: string;
  password: string;
}

export async function loginService(input: LoginInput): Promise<string> {
  const client = AxiosClient.getInstance();
  const response = await client.post<{ token: string }>(
    API_ROUTES.AUTH.LOGIN,
    input,
    { skipAuth: true }
  );
  return response.data.data.token;
}
