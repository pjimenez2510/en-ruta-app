import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearCliente } from "../services/clientes.service";
import { CrearClienteData } from "../interfaces/cliente.interface";
import { toast } from "sonner";

export function useCrearCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clienteData: CrearClienteData) => crearCliente(clienteData),
    onSuccess: (data) => {
      toast.success("Cliente creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
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
        toast.error("Error al crear el cliente");
      }
      console.error("Error creating cliente:", error);
    },
  });
}
