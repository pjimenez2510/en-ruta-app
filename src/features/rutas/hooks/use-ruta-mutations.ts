// features/rutas/hooks/use-ruta-mutations.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RutaService } from "../services/ruta.service";
import { RUTA_QUERY_KEYS } from "../constants/ruta-keys";
import type {
  RutaCreate,
  RutaUpdate,
} from "../interfaces/ruta.interface";

export const useCreateRutaMutation = () => {
  const queryClient = useQueryClient();
  const service = RutaService.getInstance();

  return useMutation({
    mutationFn: (data: RutaCreate) => service.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: RUTA_QUERY_KEYS.key 
      });
    },
  });
};

export const useUpdateRutaMutation = () => {
  const queryClient = useQueryClient();
  const service = RutaService.getInstance();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RutaUpdate }) =>
      service.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: RUTA_QUERY_KEYS.key
      });
    },
  });
};

export const useDeleteRutaMutation = () => {
  const queryClient = useQueryClient();
  const service = RutaService.getInstance();

  return useMutation({
    mutationFn: (id: number) => service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: RUTA_QUERY_KEYS.key
      });
    },
  });
};