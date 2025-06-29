import { z } from "zod";

export const clienteSchema = z.object({
  nombres: z
    .string()
    .min(1, "Los nombres son requeridos")
    .min(2, "Los nombres deben tener al menos 2 caracteres")
    .max(100, "Los nombres no pueden exceder 100 caracteres"),
  apellidos: z
    .string()
    .min(1, "Los apellidos son requeridos")
    .min(2, "Los apellidos deben tener al menos 2 caracteres")
    .max(100, "Los apellidos no pueden exceder 100 caracteres"),
  telefono: z
    .string()
    .min(1, "El teléfono es requerido")
    .regex(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos"),
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("El email debe tener un formato válido"),
  esDiscapacitado: z.boolean().optional(),
  porcentajeDiscapacidad: z.coerce
    .number()
    .min(0, "El porcentaje debe ser mayor o igual a 0")
    .max(100, "El porcentaje debe ser menor o igual a 100")
    .nullable()
    .optional(),
  numeroDocumento: z
    .string()
    .min(1, "El número de documento es requerido")
    .min(10, "El número de documento debe tener al menos 10 caracteres")
    .max(20, "El número de documento no puede exceder 20 caracteres"),
  tipoDocumento: z.enum(["CEDULA", "PASAPORTE", "NIT"], {
    required_error: "El tipo de documento es requerido",
  }),
  fechaNacimiento: z
    .string()
    .min(1, "La fecha de nacimiento es requerida")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 0 && age <= 120;
    }, "La fecha de nacimiento debe ser válida"),
});

export type ClienteSchema = z.infer<typeof clienteSchema>;

export const clienteFilterSchema = z.object({
  nombres: z.string().optional(),
  apellidos: z.string().optional(),
  tipoDocumento: z.enum(["CEDULA", "PASAPORTE", "NIT"]).optional(),
  numeroDocumento: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().optional(),
  esDiscapacitado: z.boolean().optional(),
  activo: z.boolean().optional(),
});

export type ClienteFilterSchema = z.infer<typeof clienteFilterSchema>;
