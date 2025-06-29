import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { SeatType } from "../interfaces/seat-type.interface";
import { seatTypeFormSchema, SeatTypeFormValues } from "../interfaces/form-schema";

export const useSeatTypeForm = (initialData?: SeatType) => {
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

    const defaultValues: SeatTypeFormValues = {
        nombre: initialData?.nombre ?? "",
        descripcion: initialData?.descripcion ?? "",
        factorPrecio: typeof initialData?.factorPrecio === 'number' ? initialData.factorPrecio : 1.0,
        color: initialData?.color ?? "#000000",
        icono: initialData?.icono ?? "Armchair",
    };

    const form = useForm<SeatTypeFormValues>({
        defaultValues,
        resolver: zodResolver(seatTypeFormSchema),
        mode: "onChange",
        reValidateMode: "onChange",
    });

    return { form, tenantId };
};