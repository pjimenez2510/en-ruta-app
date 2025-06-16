import { z } from "zod";

const placaRegex = /^[A-Z]{3}-\d{3,4}$/;
const currentYear = new Date().getFullYear();

export const busFormSchema = z.object({
    modeloBusId: z.coerce.number({ invalid_type_error: "Seleccione el modelo de bus" }).min(1, "Por favor, seleccione un modelo de bus"),
    numero: z.coerce.number({
        required_error: "Por favor, ingrese el número del bus",
        invalid_type_error: "El número del bus debe ser un valor numérico"
    }).min(1, "Ingrese un valor correcto para número del bus"),
    placa: z.string()
        .min(1, "Por favor, ingrese la placa del bus")
        .regex(placaRegex, "La placa debe tener el formato ABC-123 o ABC-1234 (ejemplo: XYZ-789)"),
    anioFabricacion: z.coerce.number({
        required_error: "Por favor, ingrese el año de fabricación",
        invalid_type_error: "El año de fabricación debe ser un valor numérico"
    })
        .min(1900, "El año de fabricación debe ser posterior a 1900")
        .max(currentYear + 1, `El año de fabricación no puede ser posterior a ${currentYear + 1}`),
    tipoCombustible: z.string().min(1, "Por favor, seleccione el tipo de combustible"),
    fotoUrl: z.string({
        required_error: "Por favor, ingrese la imagen del bus"
    }).min(1, "Por favor, ingrese la imagen del bus"),
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