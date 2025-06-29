import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { crearVenta } from "../services/ventas.service";
import { CrearVentaData } from "../interfaces/venta.interface";
import { toast } from "sonner";

interface ApiError {
  response?: {
    data?: {
      error?: string | string[];
    };
  };
  message?: string;
}

export function useCrearVenta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ventaData: Omit<CrearVentaData, "oficinistaId">) => {
      console.log(
        "[useCrearVenta] Ejecutando mutación de venta. Datos recibidos:",
        ventaData
      );
      const session = await getSession();
      console.log("[useCrearVenta] Session obtenida:", session);
      const rol = session?.user?.role;
      const usuarioId = session?.user?.usuarioId;

      let ventaDataWithOficinista:
        | CrearVentaData
        | Omit<CrearVentaData, "oficinistaId">;
      console.log(rol === "OFICINISTA");
      if (rol === "OFICINISTA") {
        if (!usuarioId) {
          console.error(
            "[useCrearVenta] No se pudo obtener el usuarioId del oficinista. Session:",
            session
          );
          throw new Error("No se pudo obtener el usuarioId del oficinista");
        }
        ventaDataWithOficinista = {
          ...ventaData,
          oficinistaId: usuarioId,
        };
      } else {
        // No incluir oficinistaId
        ventaDataWithOficinista = { ...ventaData };
      }

      console.log(
        "[useCrearVenta] Datos finales enviados al servicio:",
        ventaDataWithOficinista
      );
      return crearVenta(ventaDataWithOficinista as CrearVentaData);
    },
    onSuccess: (data) => {
      toast.success("Venta procesada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
      return data;
    },
    onError: (error: ApiError) => {
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
