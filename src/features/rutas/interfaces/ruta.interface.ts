// features/rutas/interfaces/ruta.interface.ts
import { ApiResponse } from "@/features/config-tenant/interfaces/tenant.interface";
import type { TipoRutaBus } from "@/features/tipos-ruta-bus/interfaces/tipo-ruta-bus.interface";

export interface RutaBase {
  nombre: string;
  resolucionId: number;
  tipoRutaBusId: number;
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
  tipoRutaBus: TipoRutaBus;
  resolucion: Resolucion;
}

export type RutaCreate = RutaBase;

export type RutaUpdate = RutaBase;

export interface RutaFilter {
  nombre?: string;
  resolucionId?: number;
  tipoRutaBusId?: number;
  activo?: boolean;
  descripcion?: string;
}

export type RutaResponse = ApiResponse<Ruta>;
export type RutasResponse = ApiResponse<Ruta[]>;