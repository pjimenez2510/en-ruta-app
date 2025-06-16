export interface Route {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Bus {
  id: number;
  numero: number;
  placa: string;
  totalAsientos: number;
}

export interface RouteSchedule {
  id: number;
  horaSalida: string;
  ruta: Route;
}

export interface Trip {
  id: number;
  tenantId: number;
  conductorId: number | null;
  ayudanteId: number | null;
  fecha: string;
  horaSalidaReal: string | null;
  estado: 'PROGRAMADO' | 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO';
  observaciones: string | null;
  capacidadTotal: number;
  asientosOcupados: number;
  generacion: 'AUTOMATICA' | 'MANUAL';
  horarioRuta: RouteSchedule;
  bus: Bus;
}

export interface TripFilters {
  fecha?: Date;
  estado?: Trip['estado'];
  rutaId?: number;
  busId?: number;
}

export interface CreateTripDTO {
  fecha: string;
  horaSalidaReal?: string | null;
  estado: Trip['estado'];
  observaciones?: string | null;
  horarioRutaId: number;
  busId: number;
  conductorId?: number | null;
  ayudanteId?: number | null;
}
