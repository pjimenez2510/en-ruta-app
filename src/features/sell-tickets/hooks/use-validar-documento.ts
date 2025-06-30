import { useQuery } from "@tanstack/react-query";
import { getClientesPorCedula } from "../services/clientes.service";

export function useValidarDocumento(numeroDocumento: string) {
  return useQuery({
    queryKey: ["validar-documento", numeroDocumento],
    queryFn: () => getClientesPorCedula(numeroDocumento),
    enabled: numeroDocumento.length >= 10, // Solo consultar si tiene al menos 10 dígitos
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: false, // No reintentar si falla
  });
}
