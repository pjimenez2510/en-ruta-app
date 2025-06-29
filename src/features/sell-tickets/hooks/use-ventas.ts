import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../services/ventas.service";
import { VentaLista } from "../interfaces/venta-lista.interface";

export function useVentas(params?: {
  fechaVenta?: string;
  fechaVentaDesde?: string;
  fechaVentaHasta?: string;
}) {
  return useQuery<VentaLista[]>({
    queryKey: ["ventas", params],
    queryFn: async () => {
      const data = await getVentas(params);
      return data;
    },
  });
}
