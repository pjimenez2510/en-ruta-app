import { useQuery } from "@tanstack/react-query";
import {
  viajesPublicosService,
  ViajePublicoParams,
} from "../services/viajes-publicos.service";

export function useViajesPublicos(filtros: ViajePublicoParams) {
  const {
    data: viajes = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["viajes-publicos", filtros],
    queryFn: () => viajesPublicosService.getViajesPublicos(filtros),
    enabled: Boolean(
      filtros.estado && filtros.ciudadOrigenId && filtros.ciudadDestinoId
    ),
  });

  return {
    viajes,
    isLoading,
    error,
    refetch,
  };
}
