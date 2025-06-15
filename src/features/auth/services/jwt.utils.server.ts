import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
  tipoUsuario?: string;
  [key: string]: unknown;
}

export function getUserRoleFromTokenServer(
  token: string | undefined | null
): string | undefined {
  if (!token || typeof token !== "string") {
    return undefined;
  }
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (typeof decoded.tipoUsuario === "string") return decoded.tipoUsuario;
    if (typeof (decoded as Record<string, unknown>)["tipoUsuario"] === "string")
      return (decoded as Record<string, unknown>)["tipoUsuario"] as string;
    if (typeof (decoded as Record<string, unknown>)["role"] === "string")
      return (decoded as Record<string, unknown>)["role"] as string;
    return undefined;
  } catch (e) {
    console.error("Error decoding JWT:", e);
    return undefined;
  }
}

// Agrega estas interfaces al inicio del archivo, después de la interfaz JwtPayload existente
interface Tenant {
  id: number;
  nombre?: string;
  identificador?: string;
  // ... otras propiedades del tenant
}

interface UserTenant {
  id?: number;
  tenantId?: number;
  tenant?: Tenant;
  // ... otras propiedades de la relación usuario-tenant
}

export function getUserTenantIdFromTokenServer(
  token: string | undefined | null
): number | undefined {
  if (!token || typeof token !== "string") {
    return undefined;
  }
  try {
    const decoded = jwtDecode<JwtPayload & { tenants?: UserTenant[] }>(token);
    console.log("Token decodificado:", decoded); // Para depuración
    
    // 1. Si el token tiene la propiedad 'tenants' como array
    if (decoded.tenants && Array.isArray(decoded.tenants) && decoded.tenants.length > 0) {
      const firstTenant = decoded.tenants[0];
      // Aseguramos que el valor devuelto sea un número o undefined
      return typeof firstTenant.tenantId === 'number' 
        ? firstTenant.tenantId 
        : firstTenant.tenant?.id;
    }
    
    // 2. Si el token tiene 'tenantId' directamente
    if (typeof (decoded as any).tenantId === 'number') {
      return (decoded as any).tenantId;
    }
    
    // 3. Si el token tiene 'tenants' como objeto con 'tenantId'
    if (decoded.tenants && typeof decoded.tenants === 'object' && 'tenantId' in decoded.tenants) {
      const tenantId = (decoded.tenants as any).tenantId;
      return typeof tenantId === 'number' ? tenantId : undefined;
    }
    
    console.warn("No se pudo encontrar el tenantId en el token JWT");
    return undefined;
  } catch (e) {
    console.error("Error decodificando el token JWT:", e);
    return undefined;
  }
}