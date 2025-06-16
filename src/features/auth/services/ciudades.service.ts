import AxiosClient from "@/core/infrastructure/axios-client";

export interface Ciudad {
  id: number;
  nombre: string;
  provincia: string;
  latitud: string;
  longitud: string;
  activo: boolean;
}

interface GetCiudadesParams {
  activo?: boolean;
  nombre?: string;
  provincia?: string;
}

export const ciudadesService = {
  async getCiudades(params?: GetCiudadesParams) {
    try {
      console.log('=== Obtener Ciudades Service ===');
      const client = AxiosClient.getInstance();
      
      const response = await client.get<Ciudad[]>('/ciudades', {
        params: params
      });
      
      console.log('Ciudades obtenidas:', response.data);
      return response.data.data; // Accedemos a data.data porque la respuesta viene envuelta
    } catch (error) {
      console.error('Error al obtener ciudades:', error);
      throw error;
    }
  }
};
