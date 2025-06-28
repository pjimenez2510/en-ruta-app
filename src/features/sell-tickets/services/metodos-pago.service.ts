import { API_ROUTES } from "@/core/constants/api-routes";
import AxiosClient from "@/core/infrastructure/axios-client";
import { MetodoPago } from "../interfaces/metodo-pago.interface";

export async function getMetodosPago(): Promise<MetodoPago[]> {
  const client = AxiosClient.getInstance();
  const { data }: { data: { data: MetodoPago[] } } = await client.get(
    API_ROUTES.METODOS_PAGO.GET_ALL
  );
  return (data.data || []).filter((m: MetodoPago) => m.activo);
}
