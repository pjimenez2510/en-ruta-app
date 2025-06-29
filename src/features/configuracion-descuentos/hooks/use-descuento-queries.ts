"use client";

import { useQuery } from "@tanstack/react-query";
import { DescuentoService } from "../services/descuento.service";
import { DESCUENTO_QUERY_KEYS } from "../constants/descuento-keys";
import type { DescuentoFilter } from "../interfaces/descuento.interface";

export const useFindAllDescuentosQuery = (filter?: DescuentoFilter) => {
  const service = DescuentoService.getInstance();
  
  return useQuery({
    queryKey: DESCUENTO_QUERY_KEYS.all(filter),
    queryFn: async () => service.findAll(filter),
  });
};

export const useFindDescuentoByIdQuery = (id: number) => {
  const service = DescuentoService.getInstance();
  
  return useQuery({
    queryKey: DESCUENTO_QUERY_KEYS.one(id),
    queryFn: async () => service.findById(id),
    enabled: !!id,
  });
};

export const useFindDescuentoByTipoQuery = (tipo: string) => {
  const service = DescuentoService.getInstance();
  
  return useQuery({
    queryKey: [...DESCUENTO_QUERY_KEYS.key, "tipo", tipo],
    queryFn: async () => service.findByTipo(tipo),
    enabled: !!tipo,
  });
}; 