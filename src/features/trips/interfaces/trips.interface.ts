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
  estado: 'PROGRAMADO' | 'EN_RUTA' | 'COMPLETADO' | 'CANCELADO' | 'RETRASADO';
  observaciones: string | null;
  capacidadTotal: number;
  asientosOcupados: number;
  generacion: 'AUTOMATICA' | 'MANUAL';
  horarioRuta: RouteSchedule;
  bus: Bus;
}

export interface TripFilters {
  rutaId?: number;
  horarioRutaId?: number;
  busId?: number;
  conductorId?: number;
  ayudanteId?: number;
  fecha?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  estado?: Trip['estado'];
  generacion?: 'AUTOMATICA' | 'MANUAL';
}

export interface CreateTripDTO {
  horarioRutaId: number;
  busId: number;
  conductorId?: number | null;
  ayudanteId?: number | null;
  fecha: string;
  estado?: Trip['estado'];
  observaciones?: string | null;
  generacion?: 'MANUAL' | 'AUTOMATICA';
}
