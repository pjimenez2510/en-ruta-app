import { z } from "zod";

export const tipoRutaBusSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre del tipo de ruta es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
});

export type TipoRutaBusSchema = z.infer<typeof tipoRutaBusSchema>;

export const tipoRutaBusFilterSchema = z.object({
  nombre: z.string().optional(),
});

export type TipoRutaBusFilterSchema = z.infer<typeof tipoRutaBusFilterSchema>; 