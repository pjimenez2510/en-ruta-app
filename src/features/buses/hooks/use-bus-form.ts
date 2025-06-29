import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { busFormSchema, BusFormValues } from "../interfaces/form-schema";
import { UseFormReturn } from "react-hook-form";

export const useBusForm = (initialData?: BusFormValues & { id?: string }): { form: UseFormReturn<BusFormValues> } => {
    const form = useForm<BusFormValues>({
        resolver: zodResolver(busFormSchema),
        defaultValues: {
            modeloBusId: initialData?.modeloBusId || 0,
            numero: initialData?.numero || 0,
            placa: initialData?.placa || "",
            anioFabricacion: initialData?.anioFabricacion || new Date().getFullYear(),
            totalAsientos: initialData?.totalAsientos || 0,
            fotoUrl: initialData?.fotoUrl || "",
            tipoCombustible: initialData?.tipoCombustible || "Diésel",
            tipoRutaBusId: initialData?.tipoRutaBusId || 0
        },
    });

    return { form };
}; 