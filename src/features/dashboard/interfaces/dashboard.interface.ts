import { ApiResponse } from "@/features/config-tenant/interfaces/tenant.interface";

// Interfaces para Métricas Generales
export interface BusesMetricas {
  total: number;
  activos: number;
  mantenimiento: number;
  porcentajeActivos: number;
}

export interface RutasMetricas {
  total: number;
  activas: number;
  porcentajeActivas: number;
}

export interface ViajesMetricas {
  total: number;
  programados: number;
  enRuta: number;
  completados: number;
  cancelados: number;
  porcentajeCompletados: number;
}

export interface BoletosMetricas {
  total: number;
  confirmados: number;
  abordados: number;
  pendientes: number;
  porcentajeConfirmados: number;
}

export interface VentasMetricas {
  total: number;
  aprobadas: number;
  pendientes: number;
  porcentajeAprobadas: number;
}

export interface PersonalMetricas {
  conductores: {
    total: number;
    activos: number;
    porcentajeActivos: number;
  };
  ayudantes: {
    total: number;
    activos: number;
    porcentajeActivos: number;
  };
}

export interface MetricasGenerales {
  buses: BusesMetricas;
  rutas: RutasMetricas;
  viajes: ViajesMetricas;
  boletos: BoletosMetricas;
  ventas: VentasMetricas;
  personal: PersonalMetricas;
}

// Interfaces para Métricas Financieras
export interface VentaPorDia {
  fecha: string;
  ingresos: number;
  ventas: number;
}

export interface MetricasFinancieras {
  totalIngresos: number;
  totalDescuentos: number;
  promedioVenta: number;
  totalVentas: number;
  ventasAprobadas: number;
  ventasPorDia: VentaPorDia[];
}

// Interfaces para Viajes Recientes
export interface TipoRutaBus {
  nombre: string;
}

export interface RutaViaje {
  nombre: string;
  tipoRutaBus: TipoRutaBus;
}

export interface HorarioRuta {
  horaSalida: string;
  ruta: RutaViaje;
}

export interface BusViaje {
  numero: number;
  placa: string;
}

export interface ViajeReciente {
  id: number;
  fecha: string;
  estado: string;
  capacidadTotal: number;
  asientosOcupados: number;
  horarioRuta: HorarioRuta;
  bus: BusViaje;
  conductor: string | null;
}

// Interfaces para Boletos Recientes
export interface ClienteBoleto {
  nombres: string;
  apellidos: string;
}

export interface ViajeBoleto {
  horarioRuta: {
    ruta: {
      nombre: string;
    };
  };
}

export interface BoletoReciente {
  id: number;
  codigoAcceso: string;
  estado: string;
  precioFinal: string;
  fechaViaje: string;
  cliente: ClienteBoleto;
  viaje: ViajeBoleto;
}

// Interfaces para Ocupación por Tipo de Ruta
export interface OcupacionPorTipoRuta {
  nombre: string;
  capacidadTotal: number;
  asientosOcupados: number;
  viajes: number;
  porcentajeOcupacion: number;
}

// Interfaces para Estadísticas por Día
export interface EstadisticaPorDia {
  fecha: string;
  viajes: number;
  viajesCompletados: number;
  boletos: number;
  ingresos: number;
  ocupacionPromedio: number;
}

// Interface para el Resumen Completo
export interface ResumenCompleto {
  metricasGenerales: MetricasGenerales;
  metricasFinancieras: MetricasFinancieras;
  viajesRecientes: ViajeReciente[];
  boletosRecientes: BoletoReciente[];
  ocupacionPorTipoRuta: OcupacionPorTipoRuta[];
  estadisticasPorDia: EstadisticaPorDia[];
  timestamp: string;
}

// Tipos de respuesta de la API
export type MetricasGeneralesResponse = ApiResponse<MetricasGenerales>;
export type MetricasFinancierasResponse = ApiResponse<MetricasFinancieras>;
export type ViajesRecientesResponse = ApiResponse<ViajeReciente[]>;
export type BoletosRecientesResponse = ApiResponse<BoletoReciente[]>;
export type OcupacionPorTipoRutaResponse = ApiResponse<OcupacionPorTipoRuta[]>;
export type EstadisticasPorDiaResponse = ApiResponse<EstadisticaPorDia[]>;
export type ResumenCompletoResponse = ApiResponse<ResumenCompleto>;

// Interfaces para filtros y parámetros
export interface DashboardFilters {
  limite?: number;
  dias?: number;
  fechaInicio?: string;
  fechaFin?: string;
} 