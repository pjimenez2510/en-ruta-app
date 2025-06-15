import { createAuthApi } from "@/core/infrastructure/auth-axios";
import { API_ROUTES } from "@/core/constants/api-routes";
import type {
  ConfigTenantResponse,
  ConfigTenant,
  CreateConfigTenantDto,
  UpdateConfigTenantDto,
} from "../interfaces/config-tenant.interface";

// Función auxiliar para reemplazar parámetros en la URL
const buildUrl = (
  path: string,
  params: Record<string, string | number> = {}
): string => {
  let url = path;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, String(value));
  });
  return url;
};

export const configTenantService = {
  // Obtener una configuración por ID
  getConfigTenantById: async (id: number): Promise<ConfigTenant> => {
    try {
      const api = await createAuthApi();
      const url = buildUrl(API_ROUTES.CONFIG_TENANT.GET_BY_ID, { id });
      const { data } = await api.get<ConfigTenantResponse>(url);
      return data.data[0];
    } catch (error) {
      console.error("Error en configTenantService.getConfigTenantById:", error);
      throw error;
    }
  },

  // Obtener todas las configuraciones de un tenant
  getAllConfigTenants: async (tenantId: number): Promise<ConfigTenant[]> => {
    try {
      const api = await createAuthApi();
      const { data } = await api.get<ConfigTenantResponse>(
        `${API_ROUTES.CONFIG_TENANT.GET_ALL}?tenantId=${tenantId}`
      );
      return data.data;
    } catch (error) {
      console.error("Error en configTenantService.getAllConfigTenants:", error);
      throw error;
    }
  },

  // Crear una nueva configuración
  createConfigTenant: async (
    configData: CreateConfigTenantDto
  ): Promise<ConfigTenant> => {
    try {
      const api = await createAuthApi();
      const { data } = await api.post<ConfigTenantResponse>(
        API_ROUTES.CONFIG_TENANT.POST,
        configData
      );
      return data.data[0];
    } catch (error) {
      console.error("Error en configTenantService.createConfigTenant:", error);
      throw error;
    }
  },

  // Actualizar una configuración
  updateConfigTenant: async (
    id: number,
    configData: UpdateConfigTenantDto
  ): Promise<ConfigTenant> => {
    try {
      const api = await createAuthApi();
      const url = buildUrl(API_ROUTES.CONFIG_TENANT.UPDATE, { id });
      const { data } = await api.put<ConfigTenantResponse>(url, configData);
      return data.data[0];
    } catch (error) {
      console.error("Error en configTenantService.updateConfigTenant:", error);
      throw error;
    }
  },

  // Eliminar una configuración
  deleteConfigTenant: async (id: number): Promise<void> => {
    try {
      const api = await createAuthApi();
      const url = buildUrl(API_ROUTES.CONFIG_TENANT.DELETE, { id });
      await api.delete(url);
    } catch (error) {
      console.error("Error en configTenantService.deleteConfigTenant:", error);
      throw error;
    }
  },
};
