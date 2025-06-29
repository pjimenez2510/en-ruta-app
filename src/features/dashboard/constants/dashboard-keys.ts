import type { DashboardFilters } from "../interfaces/dashboard.interface";

const BASE_KEY = "dashboard";

export const DASHBOARD_QUERY_KEYS = {
  key: [BASE_KEY],
  metricasGenerales: () => [BASE_KEY, "metricas-generales"],
  metricasFinancieras: (filters?: DashboardFilters) => [BASE_KEY, "metricas-financieras", filters],
  viajesRecientes: (filters?: DashboardFilters) => [BASE_KEY, "viajes-recientes", filters],
  boletosRecientes: (filters?: DashboardFilters) => [BASE_KEY, "boletos-recientes", filters],
  ocupacionPorTipoRuta: () => [BASE_KEY, "ocupacion-por-tipo-ruta"],
  estadisticasPorDia: (filters?: DashboardFilters) => [BASE_KEY, "estadisticas-por-dia", filters],
  resumenCompleto: () => [BASE_KEY, "resumen-completo"],
}; 