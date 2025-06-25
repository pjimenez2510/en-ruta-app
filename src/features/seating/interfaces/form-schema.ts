import * as z from "zod";
import { IconName } from "../constants/available-icons";

export const seatTypeFormSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    descripcion: z.string().min(1, "La descripción es requerida"),
    factorPrecio: z.preprocess(
        (val) => (val === '' || val === undefined ? undefined : Number(val)),
        z.number({ invalid_type_error: "El factor de precio es requerido" })
            .min(0.01, "El factor de precio debe ser un número positivo")
    ),
    color: z.string().min(1, "El color es requerido"),
    icono: z.string().min(1, "El icono es requerido"),
});

export type SeatTypeFormValues = z.infer<typeof seatTypeFormSchema>;