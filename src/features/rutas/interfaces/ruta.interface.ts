// features/rutas/interfaces/ruta.interface.ts
import { ApiResponse } from "@/features/config-tenant/interfaces/tenant.interface";

export interface RutaBase {
  nombre: string;
  resolucionId: number;
  descripcion: string;
  activo?: boolean;
}

export interface Tenant {
  id: number;
  nombre: string;
}

export interface Resolucion {
  id: number;
  numeroResolucion: string;
  fechaEmision: string;
  fechaVigencia: string;
  documentoUrl: string;
  descripcion: string;
  activo: boolean;
}

export interface Ruta extends RutaBase {
  id: number;
  tenantId: number;
  tenant: Tenant;
  resolucion: Resolucion;
}

export type RutaCreate = RutaBase;

export type RutaUpdate = RutaBase;

export interface RutaFilter {
  nombre?: string;
  resolucionId?: number;
  activo?: boolean;
  descripcion?: string;
}

export type RutaResponse = ApiResponse<Ruta>;
export type RutasResponse = ApiResponse<Ruta[]>;