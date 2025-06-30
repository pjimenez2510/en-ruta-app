import { ResponseAPI } from "@/core/interfaces/api.interface";

export interface Ciudad {
  id: number;
  nombre: string;
  provincia: string;
}

export interface Parada {
  id: number;
  tiempoAcumulado: number;
  orden: number;
  precioAcumulado: string;
  ciudad: Ciudad;
}

export interface Ruta {
  id: number;
  nombre: string;
  descripcion: string;
  paradas: Parada[];
}

export interface HorarioRuta {
  id: number;
  horaSalida: string;
  ruta: Ruta;
}

export interface Bus {
  id: number;
  numero: number;
  placa: string;
  totalAsientos: number;
}

export interface ViajePublico {
  id: number;
  tenantId: number;
  conductorId: number;
  ayudanteId: number;
  fecha: string;
  horaSalidaReal: string | null;
  estado: string;
  observaciones: string | null;
  capacidadTotal: number;
  asientosOcupados: number;
  generacion: string;
  horarioRuta: HorarioRuta;
  bus: Bus;
  precio: number;
  tiempoViaje: number;
}

export type ViajesPublicosResponse = ResponseAPI<ViajePublico[]>;
