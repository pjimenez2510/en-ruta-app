import * as z from "zod";

export const generalFormSchema = z.object({
  nombreCooperativa: z.string().min(1, {
    message: "El nombre de la cooperativa es requerido.",
  }),
  direccion: z.string().optional(),
  telefono: z.string().min(1, {
    message: "El teléfono es requerido.",
  }),
  email: z.string().email({
    message: "Ingrese un correo electrónico válido.",
  }),
  ruc: z
    .string()
    .length(13, { message: "El RUC debe tener 13 dígitos." })
    .optional()
    .or(z.literal("")),
  sitioWeb: z.string().url({ message: "Ingrese una URL válida." }).optional(),
});

export const socialFormSchema = z.object({
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
});

export const soporteFormSchema = z.object({
  emailSoporte: z.string().email("Email inválido").optional().or(z.literal("")),
  telefonoSoporte: z.string().optional().or(z.literal("")),
  horarioAtencion: z.string().optional().or(z.literal("")),
});

export type GeneralFormValues = z.infer<typeof generalFormSchema>;
export type SocialFormValues = z.infer<typeof socialFormSchema>;
export type SupportFormValues = z.infer<typeof soporteFormSchema>;

export interface Colors {
  primario: string;
  secundario: string;
}

export interface ColorPickerState {
  primario: boolean;
  secundario: boolean;
}
