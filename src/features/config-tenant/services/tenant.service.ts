// features/config-tenant/services/tenant.service.ts
import { createAuthApi } from '@/core/infrastructure/auth-axios';
import { API_ROUTES } from '@/core/constants/api-routes';
import type { TenantResponse } from '../interfaces/tenant.interface';

// Función auxiliar para reemplazar parámetros en la URL
const buildUrl = (path: string, params: Record<string, string | number> = {}): string => {
  let url = path;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, String(value));
  });
  return url;
};

export const tenantService = {
  // Obtener un tenant por ID
  getTenantById: async (id: number): Promise<TenantResponse> => {
    try {
      const api = await createAuthApi();
      const url = buildUrl(API_ROUTES.TENANTS.GET_BY_ID, { id });
      const { data } = await api.get<TenantResponse>(url);
      return data;
    } catch (error) {
      console.error('Error en tenantService.getTenantById:', error);
      throw error;
    }
  },

  // Obtener todos los tenants
  getAllTenants: async (): Promise<TenantResponse[]> => {
    try {
      const api = await createAuthApi();
      const { data } = await api.get<TenantResponse[]>(API_ROUTES.TENANTS.GET_ALL);
      return data;
    } catch (error) {
      console.error('Error en tenantService.getAllTenants:', error);
      throw error;
    }
  },

  // Actualizar un tenant
  updateTenant: async (id: number, tenantData: Partial<TenantResponse>): Promise<TenantResponse> => {
    try {
      const api = await createAuthApi();
      const url = buildUrl(API_ROUTES.TENANTS.UPDATE, { id });
      const { data } = await api.put<TenantResponse>(url, tenantData);
      return data;
    } catch (error) {
      console.error('Error en tenantService.updateTenant:', error);
      throw error;
    }
  },

  // Eliminar un tenant
  deleteTenant: async (id: number): Promise<void> => {
    try {
      const api = await createAuthApi();
      const url = buildUrl(API_ROUTES.TENANTS.DELETE, { id });
      await api.delete(url);
    } catch (error) {
      console.error('Error en tenantService.deleteTenant:', error);
      throw error;
    }
  }
};