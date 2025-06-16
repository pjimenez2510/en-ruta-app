import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paradasService, Parada } from '../services/paradas.service';
import { toast } from "sonner";

export function useParadas(rutaId: number) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const {
    data: paradas = [],
    isLoading: isLoadingParadas,
    error: paradasError
  } = useQuery({
    queryKey: ['paradas', rutaId],
    queryFn: () => paradasService.getParadasByRuta(rutaId),
  });

  const { mutateAsync: createParada, isPending: isCreating } = useMutation({
    mutationFn: async (data: Omit<Parada, 'id' | 'rutaId'>) => {
      // Obtener la última parada para validar el orden
      const ultimaParada = await paradasService.getUltimaParada(rutaId);
      const nuevoOrden = data.orden;
      
      // Validar que el orden sea mayor que el último
      if (ultimaParada && nuevoOrden <= ultimaParada.orden) {
        throw new Error(`El orden debe ser mayor que ${ultimaParada.orden}`);
      }

      // Validar que el precio sea mayor que el último
      if (ultimaParada && data.precioAcumulado <= ultimaParada.precioAcumulado) {
        throw new Error(`El precio debe ser mayor que ${ultimaParada.precioAcumulado}`);
      }

      return paradasService.createParada({
        ...data,
        rutaId,
        activo: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paradas', rutaId] });
      toast.success("Parada creada correctamente", {
        description: "La parada se ha agregado exitosamente a la ruta",
      });
    },
    onError: (error: Error) => {
      console.error('Error al crear parada:', error);
      toast.error(error.message || "Error al crear la parada", {
        description: "Verifique los datos e intente nuevamente",
      });
      setError(error.message);
    },
  });

  const { mutateAsync: updateParada, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Parada> }) => {
      return paradasService.updateParada(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paradas', rutaId] });
      toast.success("Parada actualizada correctamente", {
        description: "Los cambios se han guardado exitosamente",
      });
    },
    onError: (error: Error) => {
      console.error('Error al actualizar parada:', error);
      toast.error("Error al actualizar la parada", {
        description: error.message || "Intente nuevamente",
      });
      setError(error.message);
    },
  });

  const { mutateAsync: deleteParada, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => paradasService.deleteParada(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paradas', rutaId] });
      toast.success("Parada eliminada correctamente", {
        description: "La parada se ha eliminado de la ruta",
      });
    },
    onError: (error: Error) => {
      console.error('Error al eliminar parada:', error);
      toast.error("Error al eliminar la parada", {
        description: error.message || "Intente nuevamente",
      });
      setError(error.message);
    },
  });

  return {
    paradas,
    isLoadingParadas,
    paradasError,
    createParada,
    updateParada,
    deleteParada,
    isLoading: isLoadingParadas || isCreating || isUpdating || isDeleting,
    error
  };
}