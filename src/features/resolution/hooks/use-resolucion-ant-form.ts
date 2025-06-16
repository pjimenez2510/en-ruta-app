// features/resoluciones-ant/hooks/use-resolucion-ant-form.ts
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  resolucionAntSchema,
  ResolucionAntSchema,
} from "../schemas/resolucion-ant.schema";
import {
  useCreateResolucionAntMutation,
  useUpdateResolucionAntMutation,
} from "./use-resolucion-ant-mutations";
import type { ResolucionAnt } from "../interfaces/resolucion-ant.interface";

// Mapper functions
const mapResolucionAntToSchema = (resolucion?: ResolucionAnt): ResolucionAntSchema => {
  if (!resolucion) {
    return {
      numeroResolucion: "",
      fechaEmision: "",
      fechaVigencia: "",
      documentoUrl: "",
      descripcion: "",
      activo: true,
    };
  }

  return {
    numeroResolucion: resolucion.numeroResolucion,
    fechaEmision: resolucion.fechaEmision.split("T")[0], // Convert to YYYY-MM-DD format
    fechaVigencia: resolucion.fechaVigencia.split("T")[0], // Convert to YYYY-MM-DD format
    documentoUrl: resolucion.documentoUrl,
    descripcion: resolucion.descripcion,
    activo: resolucion.activo ?? true,
  };
};

const mapSchemaToCreatePayload = (data: ResolucionAntSchema) => ({
  numeroResolucion: data.numeroResolucion,
  fechaEmision: new Date(data.fechaEmision).toISOString(),
  fechaVigencia: new Date(data.fechaVigencia).toISOString(),
  documentoUrl: data.documentoUrl,
  descripcion: data.descripcion,
  activo: data.activo,
});

const mapSchemaToUpdatePayload = (data: ResolucionAntSchema) => ({
  numeroResolucion: data.numeroResolucion,
  fechaEmision: new Date(data.fechaEmision).toISOString(),
  fechaVigencia: new Date(data.fechaVigencia).toISOString(),
  documentoUrl: data.documentoUrl,
  descripcion: data.descripcion,
  activo: data.activo,
});

export const useResolucionAntForm = (resolucion?: ResolucionAnt) => {
  const isEditing = !!resolucion;
  const router = useRouter();

  const form = useForm<ResolucionAntSchema>({
    resolver: zodResolver(resolucionAntSchema),
    defaultValues: mapResolucionAntToSchema(resolucion),
  });

  const createMutation = useCreateResolucionAntMutation();
  const updateMutation = useUpdateResolucionAntMutation();

  const onSubmit: SubmitHandler<ResolucionAntSchema> = async (data) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: resolucion.id,
          data: mapSchemaToUpdatePayload(data),
        });
        toast.success("Resolución ANT actualizada exitosamente");
      } else {
        await createMutation.mutateAsync(mapSchemaToCreatePayload(data));
        toast.success("Resolución ANT creada exitosamente");
      }
      router.push("/admin/resoluciones-ant");
    } catch (error) {
      console.error("Error al guardar resolución ANT:", error);
      toast.error(
        isEditing 
          ? "Error al actualizar la resolución ANT" 
          : "Error al crear la resolución ANT"
      );
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
    isEditing,
  };
};