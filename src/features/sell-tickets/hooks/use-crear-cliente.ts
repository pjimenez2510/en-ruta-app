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
    onError: (error) => {
      toast.error("Error al crear el cliente");
      console.error("Error creating cliente:", error);
    },
  });
}
