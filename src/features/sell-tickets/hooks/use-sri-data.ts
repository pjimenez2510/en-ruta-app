import { useMutation } from "@tanstack/react-query";
import { fetchSRIData } from "../services/clientes.service";
import { toast } from "sonner";

export function useSRIData() {
  return useMutation({
    mutationFn: (cedula: string) => fetchSRIData(cedula),
    onSuccess: (data) => {
      toast.success("Información encontrada en el SRI");
      return data;
    },
    onError: (error) => {
      toast.error("Error al buscar en el SRI");
      console.error("Error fetching SRI data:", error);
    },
  });
}
