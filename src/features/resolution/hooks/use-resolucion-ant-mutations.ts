// features/resoluciones-ant/hooks/use-resolucion-ant-mutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ResolucionAntService } from "../services/resolucion-ant.service";
import { RESOLUCION_ANT_QUERY_KEYS } from "../constants/resolucion-ant-keys";
import type {
  ResolucionAntCreate,
  ResolucionAntUpdate,
} from "../interfaces/resolucion-ant.interface";

export const useCreateResolucionAntMutation = () => {
  const queryClient = useQueryClient();
  const service = ResolucionAntService.getInstance();

  return useMutation({
    mutationFn: (data: ResolucionAntCreate) => service.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: RESOLUCION_ANT_QUERY_KEYS.key 
      });
    },
  });
};

export const useUpdateResolucionAntMutation = () => {
  const queryClient = useQueryClient();
  const service = ResolucionAntService.getInstance();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ResolucionAntUpdate }) =>
      service.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: RESOLUCION_ANT_QUERY_KEYS.key
      });
    },
  });
};

export const useDeleteResolucionAntMutation = () => {
  const queryClient = useQueryClient();
  const service = ResolucionAntService.getInstance();

  return useMutation({
    mutationFn: (id: number) => service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: RESOLUCION_ANT_QUERY_KEYS.key
      });
    },
  });
};