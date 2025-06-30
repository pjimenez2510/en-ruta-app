import { API_ROUTES } from "@/core/constants/api-routes";
import AxiosClient from "@/core/infrastructure/axios-client";
import { BusDisponibilidad } from "../interfaces/bus-disponibilidad.interface";

export async function getBusDisponibilidad(params: {
  id: number;
  viajeId: number;
  ciudadOrigenId: number;
  ciudadDestinoId: number;
}): Promise<BusDisponibilidad> {
  const client = AxiosClient.getInstance();
  const url = API_ROUTES.BUSES.DISPONIBILIDAD.replace(
    ":id",
    params.id.toString()
  );
  const { data }: { data: { data: BusDisponibilidad } } = await client.get(
    url,
    {
      params: {
        viajeId: params.viajeId,
        ciudadOrigenId: params.ciudadOrigenId,
        ciudadDestinoId: params.ciudadDestinoId,
      },
    }
  );
  return data.data;
}
