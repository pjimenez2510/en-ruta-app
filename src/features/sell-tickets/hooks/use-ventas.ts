import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVentas, confirmarVenta, cancelarVenta, verificarVenta, rechazarVenta } from "../services/ventas.service";
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

export function useConfirmarVentaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => confirmarVenta(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
    },
  });
}

export function useCancelarVentaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cancelarVenta(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
    },
  });
}

export function useVerificarVentaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => verificarVenta(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
    },
  });
}

export function useRechazarVentaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => rechazarVenta(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
    },
  });
}
