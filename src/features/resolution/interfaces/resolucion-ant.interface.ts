import { ApiResponse } from "@/features/config-tenant/interfaces/tenant.interface";

export interface ResolucionAntBase {
    numeroResolucion: string;
    fechaEmision: string;
    fechaVigencia: string;
    documentoUrl: string;
    descripcion: string;
    activo?: boolean;
  }
  
  export interface ResolucionAnt extends ResolucionAntBase {
    id: number;
  }
  
  export interface ResolucionAntCreate extends ResolucionAntBase {}
  
  export interface ResolucionAntUpdate extends ResolucionAntBase {}
  
  export interface ResolucionAntFilter {
    numeroResolucion?: string;
    fechaEmision?: string;
    fechaVigencia?: string;
    activo?: boolean;
    descripcion?: string;
  }
  
  
  export type ResolucionAntResponse = ApiResponse<ResolucionAnt>;
  export type ResolucionesAntResponse = ApiResponse<ResolucionAnt[]>;