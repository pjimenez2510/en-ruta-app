"use client";

import { useQuery } from "@tanstack/react-query";
import { TipoRutaBusService } from "../services/tipo-ruta-bus.service";
import { TIPO_RUTA_BUS_QUERY_KEYS } from "../constants/tipo-ruta-bus-keys";
import type { TipoRutaBusFilter } from "../interfaces/tipo-ruta-bus.interface";

export const useFindAllTiposRutaBusQuery = (filter?: TipoRutaBusFilter) => {
  const service = TipoRutaBusService.getInstance();
  
  return useQuery({
    queryKey: TIPO_RUTA_BUS_QUERY_KEYS.all(filter),
    queryFn: async () => service.findAll(filter),
  });
};

export const useFindTipoRutaBusByIdQuery = (id: number) => {
  const service = TipoRutaBusService.getInstance();
  
  return useQuery({
    queryKey: TIPO_RUTA_BUS_QUERY_KEYS.one(id),
    queryFn: async () => service.findById(id),
    enabled: !!id,
  });
}; 