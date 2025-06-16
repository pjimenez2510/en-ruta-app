// features/resoluciones-ant/hooks/use-resolucion-ant-queries.ts
import { useQuery } from "@tanstack/react-query";
import { ResolucionAntService } from "../services/resolucion-ant.service";
import { RESOLUCION_ANT_QUERY_KEYS } from "../constants/resolucion-ant-keys";
import type { ResolucionAntFilter } from "../interfaces/resolucion-ant.interface";

export const useFindAllResolucionesAntQuery = (filter?: ResolucionAntFilter) => {
  const service = ResolucionAntService.getInstance();
  
  return useQuery({
    queryKey: RESOLUCION_ANT_QUERY_KEYS.all(filter),
    queryFn: async () => service.findAll(filter),
  });
};

export const useFindResolucionAntByIdQuery = (id: number) => {
  const service = ResolucionAntService.getInstance();
  
  return useQuery({
    queryKey: RESOLUCION_ANT_QUERY_KEYS.one(id),
    queryFn: async () => service.findById(id),
    enabled: !!id,
  });
};