import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";

interface Ruta {
  id?: number;
  nombre: string;
  descripcion: string;
  tenantId: number;
  activo: boolean;
  // Agrega aquí más propiedades según necesites
}

export const rutasService = {
  async getRutas() {
    const client = AxiosClient.getInstance();
    const response = await client.get<Ruta[]>(API_ROUTES.RUTAS.GET_ALL);
    return response.data;
  },

  async createRuta(data: Omit<Ruta, 'id'>) {
    try {
      console.log('=== Crear Ruta Service ===');
      console.log('URL:', API_ROUTES.RUTAS.CREATE);
      console.log('Data:', data);

      const client = AxiosClient.getInstance();
      const response = await client.post<Ruta>(API_ROUTES.RUTAS.CREATE, data);
      
      console.log('Respuesta:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear ruta:', error);
      throw error;
    }
  },

  async updateRuta(id: number, data: Partial<Ruta>) {
    const client = AxiosClient.getInstance();
    const url = API_ROUTES.RUTAS.UPDATE.replace(':id', id.toString());
    const response = await client.put<Ruta>(url, data);
    return response.data;
  },

  async deleteRuta(id: number) {
    const client = AxiosClient.getInstance();
    const url = API_ROUTES.RUTAS.DELETE.replace(':id', id.toString());
    const response = await client.delete(url);
    return response.data;
  },

  async getRutasByTenant(tenantId: number) {
    const client = AxiosClient.getInstance();
    const url = API_ROUTES.RUTAS.GET_BY_TENANT.replace(':tenantId', tenantId.toString());
    const response = await client.get<Ruta[]>(url);
    return response.data;
  }
};
