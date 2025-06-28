import { useQuery } from "@tanstack/react-query";
import { getMetodosPago } from "../services/metodos-pago.service";

export function useMetodosPago() {
  const {
    data: metodosPago = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["metodos-pago"],
    queryFn: getMetodosPago,
  });

  return {
    metodosPago,
    isLoading,
    error,
    refetch,
  };
}
