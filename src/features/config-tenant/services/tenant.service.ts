// features/config-tenant/services/tenant.service.ts
import { createAuthApi } from '@/core/infrastructure/auth-axios';
import type { TenantResponse } from '../interfaces/tenant.interface';

export const tenantService = {
  getTenantById: async (id: number): Promise<TenantResponse> => {
    try {
      const api = await createAuthApi();
      const { data } = await api.get<TenantResponse>(`/tenants/${id}`);
      return data;
    } catch (error) {
      console.error('Error en tenantService.getTenantById:', error);
      throw error;
    }
  },
};