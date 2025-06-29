import { ApiResponse } from "@/features/config-tenant/interfaces/tenant.interface";

export interface DescuentoBase {
  tipo: "MENOR_EDAD" | "TERCERA_EDAD" | "DISCAPACIDAD";
  requiereValidacion?: boolean;
  activo?: boolean;
}

export interface Descuento extends DescuentoBase {
  id: number;
  tenantId: number;
  porcentaje: string;
}

export interface DescuentoCreate extends DescuentoBase {
  porcentaje: number;
} ;

export interface DescuentoUpdate extends DescuentoBase {
  porcentaje: number;
} ;

export interface DescuentoFilter {
  tipo?: "MENOR_EDAD" | "TERCERA_EDAD" | "DISCAPACIDAD";
  porcentajeMinimo?: number;
  porcentajeMaximo?: number;
  requiereValidacion?: boolean;
  activo?: boolean;
}

export type DescuentoResponse = ApiResponse<Descuento>;
export type DescuentosResponse = ApiResponse<Descuento[]>; 