import { ApiResponse } from "@/features/config-tenant/interfaces/tenant.interface";

export interface TipoRutaBusBase {
  nombre: string;
}

export interface TipoRutaBus extends TipoRutaBusBase {
  id: number;
}

export type TipoRutaBusCreate = TipoRutaBusBase;

export type TipoRutaBusUpdate = TipoRutaBusBase;

export interface TipoRutaBusFilter {
  nombre?: string;
}

export type TipoRutaBusResponse = ApiResponse<TipoRutaBus>;
export type TiposRutaBusResponse = ApiResponse<TipoRutaBus[]>; 