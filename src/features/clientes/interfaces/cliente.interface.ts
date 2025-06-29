import { ApiResponse } from "@/features/config-tenant/interfaces/tenant.interface";

export interface ClienteBase {
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  esDiscapacitado?: boolean;
  porcentajeDiscapacidad?: number | null;
  numeroDocumento: string;
  tipoDocumento: "CEDULA" | "PASAPORTE" | "NIT";
  fechaNacimiento: string;
}

export interface Cliente extends ClienteBase {
  id: number;
  fechaRegistro: string;
  ultimaActualizacion: string;
  activo: boolean;
}

export type ClienteCreate = ClienteBase;

export type ClienteUpdate = ClienteBase;

export interface ClienteFilter {
  nombres?: string;
  apellidos?: string;
  tipoDocumento?: "CEDULA" | "PASAPORTE" | "NIT";
  numeroDocumento?: string;
  telefono?: string;
  email?: string;
  esDiscapacitado?: boolean;
  activo?: boolean;
}

export type ClienteResponse = ApiResponse<Cliente>;
export type ClientesResponse = ApiResponse<Cliente[]>; 