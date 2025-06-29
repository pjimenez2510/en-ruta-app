"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { tipoRutaBusSchema, type TipoRutaBusSchema } from "../schemas/tipo-ruta-bus.schema";
import { useCreateTipoRutaBusMutation, useUpdateTipoRutaBusMutation } from "./use-tipo-ruta-bus-mutations";
import type { TipoRutaBus } from "../interfaces/tipo-ruta-bus.interface";

interface UseTipoRutaBusFormReturn {
  form: UseFormReturn<TipoRutaBusSchema>;
  onSubmit: (data: TipoRutaBusSchema) => Promise<void>;
  isSubmitting: boolean;
  isEditing: boolean;
}

export const useTipoRutaBusForm = (tipoRutaBus?: TipoRutaBus): UseTipoRutaBusFormReturn => {
  const router = useRouter();
  const createMutation = useCreateTipoRutaBusMutation();
  const updateMutation = useUpdateTipoRutaBusMutation();
  
  const isEditing = !!tipoRutaBus;
  
  const form = useForm<TipoRutaBusSchema>({
    resolver: zodResolver(tipoRutaBusSchema),
    defaultValues: {
      nombre: tipoRutaBus?.nombre || "",
    },
  });

  const onSubmit = async (data: TipoRutaBusSchema): Promise<void> => {
    try {
      if (isEditing && tipoRutaBus) {
        await updateMutation.mutateAsync({ id: tipoRutaBus.id, data });
        toast.success("Tipo de ruta de bus actualizado exitosamente");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Tipo de ruta de bus creado exitosamente");
      }
      router.push("/main/tipos-ruta-bus");
    } catch (error) {
      console.error("Error al procesar tipo de ruta de bus:", error);
      toast.error(
        isEditing 
          ? "Error al actualizar el tipo de ruta de bus" 
          : "Error al crear el tipo de ruta de bus"
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