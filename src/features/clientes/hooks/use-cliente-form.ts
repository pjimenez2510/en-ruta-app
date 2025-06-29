"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clienteSchema, type ClienteSchema } from "../schemas/cliente.schema";
import { useCreateClienteMutation, useUpdateClienteMutation } from "./use-cliente-mutations";
import type { Cliente } from "../interfaces/cliente.interface";

interface UseClienteFormReturn {
  form: UseFormReturn<ClienteSchema>;
  onSubmit: (data: ClienteSchema) => Promise<void>;
  isSubmitting: boolean;
  isEditing: boolean;
}

export const useClienteForm = (cliente?: Cliente): UseClienteFormReturn => {
  const router = useRouter();
  const createMutation = useCreateClienteMutation();
  const updateMutation = useUpdateClienteMutation();
  
  const isEditing = !!cliente;
  
  const form = useForm<ClienteSchema>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nombres: cliente?.nombres || "",
      apellidos: cliente?.apellidos || "",
      telefono: cliente?.telefono || "",
      email: cliente?.email || "",
      esDiscapacitado: cliente?.esDiscapacitado || false,
      porcentajeDiscapacidad: cliente?.porcentajeDiscapacidad || null,
      numeroDocumento: cliente?.numeroDocumento || "",
      tipoDocumento: cliente?.tipoDocumento || "CEDULA",
      fechaNacimiento: cliente?.fechaNacimiento || "",
    },
  });

  const onSubmit = async (data: ClienteSchema): Promise<void> => {
    try {
      if (isEditing && cliente) {
        await updateMutation.mutateAsync({ id: cliente.id, data });
        toast.success("Cliente actualizado exitosamente");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Cliente creado exitosamente");
      }
      router.push("/main/clientes");
    } catch (error) {
      console.error("Error al procesar cliente:", error);
      toast.error(
        isEditing 
          ? "Error al actualizar el cliente" 
          : "Error al crear el cliente"
      );
    }
  };

  const isSubmitting = form.formState.isSubmitting || createMutation.isPending || updateMutation.isPending;

  return {
    form,
    onSubmit,
    isSubmitting,
    isEditing,
  };
}; 