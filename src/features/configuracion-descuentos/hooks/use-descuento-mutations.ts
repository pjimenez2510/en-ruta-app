"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DescuentoService } from "../services/descuento.service";
import { DESCUENTO_QUERY_KEYS } from "../constants/descuento-keys";
import type {
  DescuentoCreate,
  DescuentoUpdate,
} from "../interfaces/descuento.interface";

export const useCreateDescuentoMutation = () => {
  const queryClient = useQueryClient();
  const service = DescuentoService.getInstance();

  return useMutation({
    mutationFn: (data: DescuentoCreate) => service.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: DESCUENTO_QUERY_KEYS.key 
      });
    },
  });
};

export const useUpdateDescuentoMutation = () => {
  const queryClient = useQueryClient();
  const service = DescuentoService.getInstance();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DescuentoUpdate }) =>
      service.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: DESCUENTO_QUERY_KEYS.key
      });
    },
  });
};

export const useDeleteDescuentoMutation = () => {
  const queryClient = useQueryClient();
  const service = DescuentoService.getInstance();

  return useMutation({
    mutationFn: (id: number) => service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: DESCUENTO_QUERY_KEYS.key
      });
    },
  });
};

export const useActivarDescuentoMutation = () => {
  const queryClient = useQueryClient();
  const service = DescuentoService.getInstance();

  return useMutation({
    mutationFn: (id: number) => service.activar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: DESCUENTO_QUERY_KEYS.key
      });
    },
  });
};

export const useDesactivarDescuentoMutation = () => {
  const queryClient = useQueryClient();
  const service = DescuentoService.getInstance();

  return useMutation({
    mutationFn: (id: number) => service.desactivar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: DESCUENTO_QUERY_KEYS.key
      });
    },
  });
}; 