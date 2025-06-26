import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { SeatType } from "../interfaces/seat-type.interface";
import { seatTypeFormSchema, SeatTypeFormValues } from "../interfaces/form-schema";

export const useSeatTypeForm = (initialData?: SeatType): { form: UseFormReturn<SeatTypeFormValues>; tenantId: number | null } => {
    const { data: session } = useSession();
    let tenantId: number | null = null;

    if (session?.user?.accessToken) {
        try {
            const decodedToken: { tenants?: Array<{ tenantId: number }> } = jwtDecode(session.user.accessToken);
            tenantId = decodedToken.tenants?.[0]?.tenantId ?? null;
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }

    const form = useForm<SeatTypeFormValues>({
        resolver: zodResolver(seatTypeFormSchema),
        defaultValues: {
            nombre: initialData?.nombre || "",
            descripcion: initialData?.descripcion || "",
            factorPrecio: initialData?.factorPrecio || 1.0,
            color: initialData?.color || "#000000",
            icono: initialData?.icono || "Armchair",
        },
        mode: "onChange",
        reValidateMode: "onChange",
    });

    return { form, tenantId };
};