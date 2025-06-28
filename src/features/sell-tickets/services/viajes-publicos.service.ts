import { API_ROUTES } from "@/core/constants/api-routes";
import AxiosClient from "@/core/infrastructure/axios-client";
import { getSession } from "next-auth/react";

export interface ViajePublicoParams {
  fecha?: string;
  estado?: string;
  ciudadOrigenId?: number;
  ciudadDestinoId?: number;
  cooperativaId?: number;
}

export const viajesPublicosService = {
  getViajesPublicos: async (params?: ViajePublicoParams) => {
    try {
      let finalParams = { ...params };
      if (!finalParams.cooperativaId) {
        // Intentar obtener el tenantId de la sesión
        const session = await getSession();
        if (session?.user?.tenantId) {
          finalParams.cooperativaId = session.user.tenantId;
        }
      }
      const client = AxiosClient.getInstance();
      const { data } = await client.get(API_ROUTES.VIAJES.PUBLICO, {
        params: finalParams,
      });
      return data.data;
    } catch (error) {
      console.error("Error al obtener viajes públicos:", error);
      throw error;
    }
  },
};
