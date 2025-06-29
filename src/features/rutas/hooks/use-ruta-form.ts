// features/rutas/hooks/use-ruta-form.ts
"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { rutaSchema, type RutaSchema } from "../schemas/ruta.schema";
import { useCreateRutaMutation, useUpdateRutaMutation } from "./use-ruta-mutations";
import type { Ruta } from "../interfaces/ruta.interface";

interface UseRutaFormReturn {
  form: UseFormReturn<RutaSchema>;
  onSubmit: (data: RutaSchema) => Promise<void>;
  isSubmitting: boolean;
  isEditing: boolean;
}

export const useRutaForm = (ruta?: Ruta): UseRutaFormReturn => {
  const router = useRouter();
  const createMutation = useCreateRutaMutation();
  const updateMutation = useUpdateRutaMutation();
  
  const isEditing = !!ruta;
  
  const form = useForm<RutaSchema>({
    resolver: zodResolver(rutaSchema),
    defaultValues: {
      nombre: ruta?.nombre || "",
      resolucionId: ruta?.resolucionId || 0,
      tipoRutaBusId: ruta?.tipoRutaBusId || 0,
      descripcion: ruta?.descripcion || "",
      activo: ruta?.activo ?? true,
    },
  });

  const onSubmit = async (data: RutaSchema): Promise<void> => {
    try {
      if (isEditing && ruta) {
        await updateMutation.mutateAsync({ id: ruta.id, data });
        toast.success("Ruta actualizada exitosamente");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Ruta creada exitosamente");
      }
      router.push("/main/routes");
    } catch (error) {
      console.error("Error al procesar ruta:", error);
      toast.error(
        isEditing 
          ? "Error al actualizar la ruta" 
          : "Error al crear la ruta"
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