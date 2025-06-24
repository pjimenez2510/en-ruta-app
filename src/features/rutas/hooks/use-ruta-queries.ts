// features/rutas/hooks/use-ruta-queries.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { RutaService } from "../services/ruta.service";
import { RUTA_QUERY_KEYS } from "../constants/ruta-keys";
import type { RutaFilter } from "../interfaces/ruta.interface";

export const useFindAllRutasQuery = (filter?: RutaFilter) => {
  const service = RutaService.getInstance();
  
  return useQuery({
    queryKey: RUTA_QUERY_KEYS.all(filter),
    queryFn: async () => service.findAll(filter),
  });
};

export const useFindRutaByIdQuery = (id: number) => {
  const service = RutaService.getInstance();
  
  return useQuery({
    queryKey: RUTA_QUERY_KEYS.one(id),
    queryFn: async () => service.findById(id),
    enabled: !!id,
  });
};