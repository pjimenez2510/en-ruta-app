// features/dashboard/index.ts

// Interfaces
export type {
  MetricasGenerales,
  MetricasFinancieras,
  ViajeReciente,
  BoletoReciente,
  OcupacionPorTipoRuta,
  EstadisticaPorDia,
  ResumenCompleto,
  DashboardFilters,
  BusesMetricas,
  RutasMetricas,
  ViajesMetricas,
  BoletosMetricas,
  VentasMetricas,
  PersonalMetricas,
  VentaPorDia,
  TipoRutaBus,
  RutaViaje,
  HorarioRuta,
  BusViaje,
  ClienteBoleto,
  ViajeBoleto,
} from "./interfaces/dashboard.interface";

// Services
export { DashboardService } from "./services/dashboard.service";

// Hooks
export {
  useMetricasGeneralesQuery,
  useMetricasFinancierasQuery,
  useViajesRecientesQuery,
  useBoletosRecientesQuery,
  useOcupacionPorTipoRutaQuery,
  useEstadisticasPorDiaQuery,
  useResumenCompletoQuery,
} from "./hooks/use-dashboard-queries";

// Constants
export { DASHBOARD_QUERY_KEYS } from "./constants/dashboard-keys";

// Schemas
export {
  dashboardFiltersSchema,
  metricasGeneralesSchema,
  metricasFinancierasSchema,
  viajeRecienteSchema,
  boletoRecienteSchema,
  ocupacionPorTipoRutaSchema,
  estadisticaPorDiaSchema,
} from "./schemas/dashboard.schema";

export type { DashboardFiltersSchema } from "./schemas/dashboard.schema";

// Components
export { DashboardOverview } from "./components/dashboard-overview";
export { MetricasGeneralesCard } from "./components/metricas-generales-card";
export { MetricasFinancierasCard } from "./components/metricas-financieras-card";
export { MetricasFinancierasConFiltros } from "./components/metricas-financieras-con-filtros";
export { ViajesRecientesCard } from "./components/viajes-recientes-card";
export { BoletosRecientesCard } from "./components/boletos-recientes-card";
export { OcupacionPorTipoRutaCard } from "./components/ocupacion-por-tipo-ruta-card";
export { EstadisticasPorDiaCard } from "./components/estadisticas-por-dia-card"; 