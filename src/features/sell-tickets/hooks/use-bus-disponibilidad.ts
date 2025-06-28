import { useQuery } from "@tanstack/react-query";
import { getBusDisponibilidad } from "../services/bus-disponibilidad.service";
import { BusDisponibilidadResponse } from "../interfaces/bus-disponibilidad.interface";

export function useBusDisponibilidad(params: {
  id: number;
  viajeId: number;
  ciudadOrigenId: number;
  ciudadDestinoId: number;
}) {
  const { data, isLoading, error, refetch } =
    useQuery<BusDisponibilidadResponse>({
      queryKey: ["bus-disponibilidad", params],
      queryFn: () => getBusDisponibilidad(params),
      enabled: Boolean(
        params.id &&
          params.viajeId &&
          params.ciudadOrigenId &&
          params.ciudadDestinoId
      ),
    });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
