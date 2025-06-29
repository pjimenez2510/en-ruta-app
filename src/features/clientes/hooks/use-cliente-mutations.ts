"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClienteService } from "../services/cliente.service";
import { CLIENTE_QUERY_KEYS } from "../constants/cliente-keys";
import type {
  ClienteCreate,
  ClienteUpdate,
} from "../interfaces/cliente.interface";

export const useCreateClienteMutation = () => {
  const queryClient = useQueryClient();
  const service = ClienteService.getInstance();

  return useMutation({
    mutationFn: (data: ClienteCreate) => service.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: CLIENTE_QUERY_KEYS.key 
      });
    },
  });
};

export const useUpdateClienteMutation = () => {
  const queryClient = useQueryClient();
  const service = ClienteService.getInstance();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ClienteUpdate }) =>
      service.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: CLIENTE_QUERY_KEYS.key
      });
    },
  });
};

export const useDeleteClienteMutation = () => {
  const queryClient = useQueryClient();
  const service = ClienteService.getInstance();

  return useMutation({
    mutationFn: (id: number) => service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: CLIENTE_QUERY_KEYS.key
      });
    },
  });
}; 