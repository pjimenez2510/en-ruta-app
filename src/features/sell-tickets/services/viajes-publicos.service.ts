import { API_ROUTES } from "@/core/constants/api-routes";
import AxiosClient from "@/core/infrastructure/axios-client";

export interface ViajePublicoParams {
  fecha?: string;
  estado?: string;
  ciudadOrigenId?: number;
  ciudadDestinoId?: number;
}

export const viajesPublicosService = {
  getViajesPublicos: async (params?: ViajePublicoParams) => {
    try {
      const client = AxiosClient.getInstance();
      const { data } = await client.get(API_ROUTES.VIAJES.PUBLICO, {
        params,
      });
      return data.data;
    } catch (error) {
      console.error("Error al obtener viajes públicos:", error);
      throw error;
    }
  },
};
