// features/config-tenant/hooks/use-tenant.ts
import { useQuery } from "@tanstack/react-query";
import { tenantService } from "../services/tenant.service";
import { TenantResponse } from "../interfaces/tenant.interface";

export const useTenant = (
  id: number | undefined,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery<TenantResponse, Error>({
    queryKey: ["tenant", id],
    queryFn: () => {
      if (id === undefined || id <= 0) {
        throw new Error("Tenant ID is invalid");
      }
      return tenantService.getTenantById(id);
    },
    enabled: options?.enabled && id !== undefined && id > 0,
    retry: false,
  });
};
