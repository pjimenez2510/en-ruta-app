import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";

export interface Parada {
  id?: number;
  rutaId: number;
  ciudadId: number;
  orden: number;
  distanciaAcumulada: number;
  tiempoAcumulado: number;
  precioAcumulado: number;
  activo?: boolean;
}

export const paradasService = {
  async getParadasByRuta(rutaId: number) {
    try {
      console.log('=== Obtener Paradas Service ===');
      const client = AxiosClient.getInstance();
      const response = await client.get<Parada[]>(`/paradas/ruta/${rutaId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener paradas:', error);
      throw error;
    }
  },

  async createParada(data: Omit<Parada, 'id'>) {
    try {
      console.log('=== Crear Parada Service ===');
      console.log('Data a enviar:', data);
      
      const client = AxiosClient.getInstance();
      const response = await client.post<Parada>('/paradas', data);
      return response.data.data;
    } catch (error) {
      console.error('Error al crear parada:', error);
      throw error;
    }
  },

  async updateParada(id: number, data: Partial<Parada>) {
    try {
      console.log('=== Actualizar Parada Service ===');
      console.log('Data a actualizar:', data);
      
      const client = AxiosClient.getInstance();
      const response = await client.put<Parada>(`/paradas/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error al actualizar parada:', error);
      throw error;
    }
  },

  async deleteParada(id: number) {
    try {
      const client = AxiosClient.getInstance();
      const response = await client.delete(`/paradas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar parada:', error);
      throw error;
    }
  },

  async getUltimaParada(rutaId: number) {
    try {
      const client = AxiosClient.getInstance();
      const response = await client.get<Parada[]>(`/paradas/ruta/${rutaId}`);
      const paradas = response.data.data || [];
      return paradas.reduce((max, parada) => 
        parada.orden > max.orden ? parada : max, 
        { orden: -1 } as Parada
      );
    } catch (error) {
      console.error('Error al obtener última parada:', error);
      throw error;
    }
  }
};
