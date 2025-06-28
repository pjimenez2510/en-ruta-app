import { API_ROUTES } from "@/core/constants/api-routes";
import AxiosClient from "@/core/infrastructure/axios-client";
import { BusDisponibilidadResponse } from "../interfaces/bus-disponibilidad.interface";

export async function getBusDisponibilidad(params: {
  id: number;
  viajeId: number;
  ciudadOrigenId: number;
  ciudadDestinoId: number;
}): Promise<BusDisponibilidadResponse> {
  const client = AxiosClient.getInstance();
  const url = API_ROUTES.BUSES.DISPONIBILIDAD.replace(
    ":id",
    params.id.toString()
  );
  const { data } = await client.get<BusDisponibilidadResponse>(url, {
    params: {
      viajeId: params.viajeId,
      ciudadOrigenId: params.ciudadOrigenId,
      ciudadDestinoId: params.ciudadDestinoId,
    },
  });
  return data;
}
