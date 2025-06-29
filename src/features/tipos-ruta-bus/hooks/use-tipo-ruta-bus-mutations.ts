"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TipoRutaBusService } from "../services/tipo-ruta-bus.service";
import { TIPO_RUTA_BUS_QUERY_KEYS } from "../constants/tipo-ruta-bus-keys";
import type {
  TipoRutaBusCreate,
  TipoRutaBusUpdate,
} from "../interfaces/tipo-ruta-bus.interface";

export const useCreateTipoRutaBusMutation = () => {
  const queryClient = useQueryClient();
  const service = TipoRutaBusService.getInstance();

  return useMutation({
    mutationFn: (data: TipoRutaBusCreate) => service.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: TIPO_RUTA_BUS_QUERY_KEYS.key 
      });
    },
  });
};

export const useUpdateTipoRutaBusMutation = () => {
  const queryClient = useQueryClient();
  const service = TipoRutaBusService.getInstance();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TipoRutaBusUpdate }) =>
      service.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: TIPO_RUTA_BUS_QUERY_KEYS.key
      });
    },
  });
};

export const useDeleteTipoRutaBusMutation = () => {
  const queryClient = useQueryClient();
  const service = TipoRutaBusService.getInstance();

  return useMutation({
    mutationFn: (id: number) => service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: TIPO_RUTA_BUS_QUERY_KEYS.key
      });
    },
  });
}; 