"use client";

import { useQuery } from "@tanstack/react-query";
import { ClienteService } from "../services/cliente.service";
import { CLIENTE_QUERY_KEYS } from "../constants/cliente-keys";
import type { ClienteFilter } from "../interfaces/cliente.interface";

export const useFindAllClientesQuery = (filter?: ClienteFilter) => {
  const service = ClienteService.getInstance();
  
  return useQuery({
    queryKey: CLIENTE_QUERY_KEYS.all(filter),
    queryFn: async () => service.findAll(filter),
  });
};

export const useFindClienteByIdQuery = (id: number) => {
  const service = ClienteService.getInstance();
  
  return useQuery({
    queryKey: CLIENTE_QUERY_KEYS.one(id),
    queryFn: async () => service.findById(id),
    enabled: !!id,
  });
}; 