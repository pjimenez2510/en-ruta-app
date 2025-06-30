import { ResponseAPI } from "@/core/interfaces/api.interface";

export interface MetodoPago {
  id: number;
  tenantId: number;
  nombre: string;
  descripcion: string;
  procesador: string | null;
  configuracion: string | null;
  activo: boolean;
  tenant: {
    id: number;
    nombre: string;
    identificador: string;
    logoUrl: string;
    colorPrimario: string;
    colorSecundario: string;
    sitioWeb: string;
    emailContacto: string;
    telefono: string;
    fechaRegistro: string;
    activo: boolean;
  };
}

export type MetodoPagoResponse = ResponseAPI<MetodoPago[]>;
