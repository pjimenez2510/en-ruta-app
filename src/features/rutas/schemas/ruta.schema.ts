// features/rutas/schemas/ruta.schema.ts
import { z } from "zod";

export const rutaSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre de la ruta es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  resolucionId: z
    .number()
    .min(1, "Debe seleccionar una resolución"),
  tipoRutaBusId: z
    .number()
    .min(1, "Debe seleccionar un tipo de ruta bus"),
  descripcion: z
    .string()
    .min(1, "La descripción es requerida")
    .max(500, "La descripción no puede exceder 500 caracteres"),
  activo: z.boolean(),
});

export type RutaSchema = z.infer<typeof rutaSchema>;

export const rutaFilterSchema = z.object({
  nombre: z.string().optional(),
  resolucionId: z.number().optional(),
  tipoRutaBusId: z.number().optional(),
  activo: z.boolean().optional(),
  descripcion: z.string().optional(),
});

export type RutaFilterSchema = z.infer<typeof rutaFilterSchema>;