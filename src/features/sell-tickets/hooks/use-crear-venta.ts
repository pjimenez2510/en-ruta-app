import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { crearVenta } from "../services/ventas.service";
import { CrearVentaData } from "../interfaces/venta.interface";
import { toast } from "sonner";

export function useCrearVenta() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (ventaData: Omit<CrearVentaData, "oficinistaId">) => {
      if (!session?.user?.id) {
        throw new Error("No se pudo obtener el ID del oficinista");
      }

      const ventaDataWithOficinista: CrearVentaData = {
        ...ventaData,
        oficinistaId: parseInt(session.user.id),
      };

      return crearVenta(ventaDataWithOficinista);
    },
    onSuccess: (data) => {
      toast.success("Venta procesada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
      return data;
    },
    onError: (error: any) => {
      // Manejar errores del backend
      if (error?.response?.data?.error) {
        const backendError = error.response.data.error;
        if (Array.isArray(backendError)) {
          // Si es un array de errores, mostrar el primero
          toast.error(backendError[0]);
        } else {
          // Si es un string
          toast.error(backendError);
        }
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Error al procesar la venta");
      }
      console.error("Error creating venta:", error);
    },
  });
}
