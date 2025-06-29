import { API_ROUTES } from "@/core/constants/api-routes";
import AxiosClient from "@/core/infrastructure/axios-client";
import { ResponseAPI } from "@/core/interfaces/api.interface";
import {
  Cliente,
  CrearClienteData,
  SRIResponse,
} from "@/features/sell-tickets/interfaces/cliente.interface";

const SRI_API_URL =
  "https://srienlinea.sri.gob.ec/movil-servicios/api/v1.0/deudas/porIdentificacion";

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

export async function fetchSRIData(cedula: string): Promise<string> {
  try {
    const response = await fetch(`${SRI_API_URL}/${cedula}`);
    const data: SRIResponse = await response.json();

    if (!data.contribuyente?.nombreComercial) {
      throw new Error("No se encontró información para esta cédula");
    }

    return data.contribuyente.nombreComercial;
  } catch (error) {
    throw new Error("Error al buscar la información: " + error);
  }
}
