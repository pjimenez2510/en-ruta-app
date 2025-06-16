// features/resoluciones-ant/schemas/resolucion-ant.schema.ts
import { z } from "zod";

export const resolucionAntSchema = z.object({
  numeroResolucion: z
    .string()
    .min(1, "El número de resolución es requerido")
    .regex(/^ANT-\d{4}-\d{3}$/, "El formato debe ser ANT-YYYY-XXX"),
  fechaEmision: z.string().min(1, "La fecha de emisión es requerida"),
  fechaVigencia: z.string().min(1, "La fecha de vigencia es requerida"),
  documentoUrl: z
    .string()
    .url("Debe ser una URL válida")
    .min(1, "La URL del documento es requerida"),
  descripcion: z
    .string()
    .min(1, "La descripción es requerida")
    .max(500, "La descripción no puede exceder 500 caracteres"),
  activo: z.boolean(),
});

export type ResolucionAntSchema = z.infer<typeof resolucionAntSchema>;

export const resolucionAntFilterSchema = z.object({
  numeroResolucion: z.string().optional(),
  fechaEmision: z.string().optional(),
  fechaVigencia: z.string().optional(),
  activo: z.boolean().optional(),
  descripcion: z.string().optional(),
});

export type ResolucionAntFilterSchema = z.infer<
  typeof resolucionAntFilterSchema
>;
