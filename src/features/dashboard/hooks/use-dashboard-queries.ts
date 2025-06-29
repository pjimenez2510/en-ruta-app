"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "../services/dashboard.service";
import { DASHBOARD_QUERY_KEYS } from "../constants/dashboard-keys";
import type { DashboardFilters } from "../interfaces/dashboard.interface";

export const useMetricasGeneralesQuery = () => {
  const service = DashboardService.getInstance();
  
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.metricasGenerales(),
    queryFn: async () => service.getMetricasGenerales(),
  });
};

export const useMetricasFinancierasQuery = (filters?: DashboardFilters) => {
  const service = DashboardService.getInstance();
  
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.metricasFinancieras(filters),
    queryFn: async () => service.getMetricasFinancieras(filters),
  });
};

export const useViajesRecientesQuery = (filters?: DashboardFilters) => {
  const service = DashboardService.getInstance();
  
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.viajesRecientes(filters),
    queryFn: async () => service.getViajesRecientes(filters),
  });
};

export const useBoletosRecientesQuery = (filters?: DashboardFilters) => {
  const service = DashboardService.getInstance();
  
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.boletosRecientes(filters),
    queryFn: async () => service.getBoletosRecientes(filters),
  });
};

export const useOcupacionPorTipoRutaQuery = () => {
  const service = DashboardService.getInstance();
  
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.ocupacionPorTipoRuta(),
    queryFn: async () => service.getOcupacionPorTipoRuta(),
  });
};

export const useEstadisticasPorDiaQuery = (filters?: DashboardFilters) => {
  const service = DashboardService.getInstance();
  
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.estadisticasPorDia(filters),
    queryFn: async () => service.getEstadisticasPorDia(filters),
  });
};

export const useResumenCompletoQuery = () => {
  const service = DashboardService.getInstance();
  
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.resumenCompleto(),
    queryFn: async () => service.getResumenCompleto(),
  });
}; 