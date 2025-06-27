import * as z from "zod";
import { IconName } from "../constants/available-icons";

export const seatTypeFormSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    descripcion: z.string().min(1, "La descripción es requerida"),
    factorPrecio: z.number({
        required_error: "El factor de precio es requerido",
        invalid_type_error: "El factor de precio debe ser un número"
    })
        .min(0.01, "El factor de precio debe ser un número positivo")
        .refine((value) => {
            const valueStr = value.toString();
            const decimals = valueStr.split('.')[1];
            return !decimals || decimals.length <= 2;
        }, "El factor de precio debe tener máximo 2 decimales"),
    color: z.string().min(1, "El color es requerido"),
    icono: z.string().min(1, "El icono es requerido") as z.ZodType<IconName>,
});

export type SeatTypeFormValues = z.infer<typeof seatTypeFormSchema>;