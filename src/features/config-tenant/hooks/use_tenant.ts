// features/config-tenant/hooks/use-tenant.ts
import { useQuery } from '@tanstack/react-query';
import { tenantService } from '../services/tenant.service';
import { TenantResponse } from '../interfaces/tenant.interface';

export const useTenant = (id: number) => {
  return useQuery<TenantResponse, Error>({
    queryKey: ['tenant', id],
    queryFn: () => tenantService.getTenantById(id)
  });
};