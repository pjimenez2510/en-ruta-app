import { ResponseAPI } from "@/core/interfaces/api.interface";

export interface BusDisponibilidad {
  id: number;
  tenantId: number;
  modeloBusId: number;
  numero: number;
  placa: string;
  anioFabricacion: number;
  totalAsientos: number;
  fotoUrl: string;
  tipoCombustible: string;
  fechaIngreso: string;
  estado: string;
  tenant: {
    id: number;
    nombre: string;
  };
  modeloBus: {
    id: number;
    marca: string;
    modelo: string;
    tipoChasis: string;
    tipoCarroceria: string;
    numeroPisos: number;
  };
  pisos: PisoDisponibilidad[];
}

export interface PisoDisponibilidad {
  id: number;
  numeroPiso: number;
  asientos: AsientoDisponibilidad[];
}

export interface AsientoDisponibilidad {
  id: number;
  numero: string;
  fila: number;
  columna: number;
  estado: string;
  notas: string | null;
  tipo: {
    id: number;
    nombre: string;
    descripcion: string;
    factorPrecio: string;
    color: string;
    icono: string;
  };
  disponible: boolean;
  precio: string;
}

export type BusDisponibilidadResponse = ResponseAPI<BusDisponibilidad>;
