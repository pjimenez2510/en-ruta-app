import { z } from "zod";

export const descuentoSchema = z.object({
  tipo: z.enum(["MENOR_EDAD", "TERCERA_EDAD", "DISCAPACIDAD"], {
    required_error: "El tipo de descuento es requerido",
  }),
  porcentaje: z
    .string()
    .min(1, "El porcentaje es requerido")
    .regex(/^\d+(\.\d{1,2})?$/, "El porcentaje debe ser un número válido (ej: 15.5)"),
  requiereValidacion: z.boolean().optional(),
  activo: z.boolean().optional(),
});

export type DescuentoSchema = z.infer<typeof descuentoSchema>;

export const descuentoFilterSchema = z.object({
  tipo: z.enum(["MENOR_EDAD", "TERCERA_EDAD", "DISCAPACIDAD"]).optional(),
  porcentajeMinimo: z.number().optional(),
  porcentajeMaximo: z.number().optional(),
  requiereValidacion: z.boolean().optional(),
  activo: z.boolean().optional(),
});

export type DescuentoFilterSchema = z.infer<typeof descuentoFilterSchema>; 