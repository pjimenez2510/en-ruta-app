import { useQuery } from "@tanstack/react-query";
import { getVentaById } from "../services/ventas.service";
import { VentaDetalle } from "../interfaces/venta-detalle.interface";

export function useVentaById(id?: number) {
  return useQuery<VentaDetalle>({
    queryKey: ["venta", id],
    queryFn: () => getVentaById(id!),
    enabled: !!id,
  });
}
