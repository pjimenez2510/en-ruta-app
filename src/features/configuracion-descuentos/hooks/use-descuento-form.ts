"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  descuentoSchema,
  type DescuentoSchema,
} from "../schemas/descuento.schema";
import {
  useCreateDescuentoMutation,
  useUpdateDescuentoMutation,
} from "./use-descuento-mutations";
import type { Descuento } from "../interfaces/descuento.interface";

interface UseDescuentoFormReturn {
  form: UseFormReturn<DescuentoSchema>;
  onSubmit: (data: DescuentoSchema) => Promise<void>;
  isSubmitting: boolean;
  isEditing: boolean;
}

export const useDescuentoForm = (
  descuento?: Descuento
): UseDescuentoFormReturn => {
  const router = useRouter();
  const createMutation = useCreateDescuentoMutation();
  const updateMutation = useUpdateDescuentoMutation();

  const isEditing = !!descuento;

  const form = useForm<DescuentoSchema>({
    resolver: zodResolver(descuentoSchema),
    defaultValues: {
      tipo: descuento?.tipo || "MENOR_EDAD",
      porcentaje: descuento?.porcentaje || "",
      requiereValidacion: descuento?.requiereValidacion || false,
      activo: descuento?.activo ?? true,
    },
  });

  const onSubmit = async (data: DescuentoSchema): Promise<void> => {
    try {
      if (isEditing && descuento) {
        await updateMutation.mutateAsync({
          id: descuento.id,
          data: { ...data, porcentaje: Number(data.porcentaje) },
        });
        toast.success("Configuración de descuento actualizada exitosamente");
      } else {
        await createMutation.mutateAsync({
          ...data,
          porcentaje: Number(data.porcentaje),
        });
        toast.success("Configuración de descuento creada exitosamente");
      }
      router.push("/main/configuracion-descuentos");
    } catch {}
  };

  const isSubmitting =
    form.formState.isSubmitting ||
    createMutation.isPending ||
    updateMutation.isPending;

  return {
    form,
    onSubmit,
    isSubmitting,
    isEditing,
  };
};
