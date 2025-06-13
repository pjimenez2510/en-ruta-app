import { z } from "zod";

const placaRegex = /^[A-Z]{3}-\d{3,4}$/;

export const busFormSchema = z.object({
    modeloBusId: z.coerce.number().min(1, "El modelo de bus es requerido"),
    numero: z.coerce.number().min(1, "El número de bus es requerido"),
    placa: z.string()
        .min(1, "La placa es requerida")
        .regex(placaRegex, "La placa debe tener el formato ABC-123 o ABC-1234"),
    anioFabricacion: z.coerce.number()
        .min(1900, "El año de fabricación debe ser válido")
        .max(2100, "El año de fabricación debe ser válido"),
    tipoCombustible: z.string().min(1, "El tipo de combustible es requerido"),
    fotoUrl: z.string().optional(),
    totalAsientos: z.coerce.number().default(0)
});

export type BusFormValues = z.infer<typeof busFormSchema>;

export interface BusFormData extends BusFormValues {
    id?: string;
    tenantId?: string;
    fechaIngreso?: string;
    estado?: string;
    modeloBus?: {
        id: number;
        marca: string;
        modelo: string;
        tipoChasis: string;
        tipoCarroceria: string;
        numeroPisos: 2;
    };
} 