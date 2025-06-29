import { API_ROUTES } from "@/core/constants/api-routes";
import AxiosClient from "@/core/infrastructure/axios-client";
import { ResponseAPI } from "@/core/interfaces/api.interface";
import {
  Cliente,
  CrearClienteData,
} from "@/features/sell-tickets/interfaces/cliente.interface";

export async function getClientesPorCedula(
  numeroDocumento: string
): Promise<Cliente[]> {
  const client = AxiosClient.getInstance();
  const { data }: { data: ResponseAPI<Cliente[]> } = await client.get(
    `${API_ROUTES.CLIENTES.GET_ALL}?numeroDocumento=${numeroDocumento}`
  );
  return data.data;
}

export async function crearCliente(
  clienteData: CrearClienteData
): Promise<Cliente> {
  const client = AxiosClient.getInstance();
  const { data }: { data: ResponseAPI<Cliente> } = await client.post(
    API_ROUTES.CLIENTES.POST,
    clienteData
  );
  return data.data;
}
