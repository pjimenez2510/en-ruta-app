import { useQuery } from '@tanstack/react-query';
import { ciudadesService } from '../services/ciudades.service';

export function useCiudades() {
  const { 
    data: ciudades = [], 
    isLoading,
    error
  } = useQuery({
    queryKey: ['ciudades'],
    queryFn: () => ciudadesService.getCiudades({ activo: true }),
  });

  return {
    ciudades,
    isLoading,
    error,
    // Función helper para transformar las ciudades al formato del combobox
    ciudadesOptions: ciudades.map((ciudad) => ({
      value: ciudad.id.toString(),
      label: `${ciudad.nombre}, ${ciudad.provincia}`,
      // Incluimos la ciudad completa por si necesitamos más datos
      ciudad: ciudad
    }))
  };
}
