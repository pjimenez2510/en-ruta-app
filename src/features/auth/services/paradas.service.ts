import AxiosClient from "@/core/infrastructure/axios-client";

export interface Ciudad {
  id: number;
  nombre: string;
  provincia: string;
  latitud: string;
  longitud: string;
  activo: boolean;
}

export interface Parada {
  id?: number;
  rutaId: number;
  ciudadId: number;
  orden: number;
  distanciaAcumulada: number | string;
  tiempoAcumulado: number;
  precioAcumulado: number | string;
  activo?: boolean;
  ciudad?: Ciudad;
}

export interface CreateParadaRutaDto {
  rutaId: number;
  ciudadId: number;
  orden: number;
  distanciaAcumulada: number;
  tiempoAcumulado: number;
  precioAcumulado: number;
}

export const paradasService = {  async getParadasByRuta(rutaId: number) {
    try {
      console.log('=== Obtener Paradas Service ===');
      const client = AxiosClient.getInstance();
      const response = await client.get<Parada[]>(`/paradas-ruta?rutaId=${rutaId}`);
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
        // Formatear los datos según el DTO requerido
      const createParadaDto: CreateParadaRutaDto = {
        rutaId: data.rutaId,
        ciudadId: data.ciudadId,
        orden: data.orden,
        distanciaAcumulada: typeof data.distanciaAcumulada === 'string' 
          ? parseFloat(data.distanciaAcumulada) 
          : data.distanciaAcumulada,
        tiempoAcumulado: data.tiempoAcumulado,
        precioAcumulado: typeof data.precioAcumulado === 'string' 
          ? parseFloat(data.precioAcumulado) 
          : data.precioAcumulado
      };
      
      const client = AxiosClient.getInstance();
      const response = await client.post<Parada>('/paradas-ruta', createParadaDto);
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
        // Formatear los datos según el DTO requerido
      const updateParadaDto: Partial<CreateParadaRutaDto> = {
        rutaId: data.rutaId,
        ciudadId: data.ciudadId,
        orden: data.orden,
        distanciaAcumulada: typeof data.distanciaAcumulada === 'string' 
          ? parseFloat(data.distanciaAcumulada) 
          : data.distanciaAcumulada,
        tiempoAcumulado: data.tiempoAcumulado,
        precioAcumulado: typeof data.precioAcumulado === 'string' 
          ? parseFloat(data.precioAcumulado) 
          : data.precioAcumulado
      };
      
      const client = AxiosClient.getInstance();
      const response = await client.put<Parada>(`/paradas-ruta/${id}`, updateParadaDto);
      return response.data.data;
    } catch (error) {
      console.error('Error al actualizar parada:', error);
      throw error;
    }
  },

  async deleteParada(id: number) {
    try {
      const client = AxiosClient.getInstance();
      const response = await client.delete(`/paradas-ruta/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar parada:', error);
      throw error;
    }
  },

  async getUltimaParada(rutaId: number) {
    try {
      const client = AxiosClient.getInstance();
      const response = await client.get<Parada[]>(`/paradas-ruta?rutaId=${rutaId}`);
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
