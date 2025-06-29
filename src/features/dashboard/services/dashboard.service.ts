import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";
import type {
  MetricasGenerales,
  MetricasFinancieras,
  ViajeReciente,
  BoletoReciente,
  OcupacionPorTipoRuta,
  EstadisticaPorDia,
  ResumenCompleto,
  DashboardFilters,
} from "../interfaces/dashboard.interface";

export class DashboardService {
  private static instance: DashboardService;
  private axiosClient: AxiosClient;

  private constructor() {
    this.axiosClient = AxiosClient.getInstance();
  }

  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  async getMetricasGenerales(): Promise<MetricasGenerales> {
    const response = await this.axiosClient.get<MetricasGenerales>(
      API_ROUTES.DASHBOARD.METRICAS_GENERALES
    );
    return response.data.data;
  }

  async getMetricasFinancieras(filters?: DashboardFilters): Promise<MetricasFinancieras> {
    const params = new URLSearchParams();
    
    if (filters?.fechaInicio) params.append("fechaInicio", filters.fechaInicio);
    if (filters?.fechaFin) params.append("fechaFin", filters.fechaFin);

    const queryString = params.toString();
    const url = `${API_ROUTES.DASHBOARD.METRICAS_FINANCIERAS}${queryString ? `?${queryString}` : ""}`;
    
    const response = await this.axiosClient.get<MetricasFinancieras>(url);
    return response.data.data;
  }

  async getViajesRecientes(filters?: DashboardFilters): Promise<ViajeReciente[]> {
    const params = new URLSearchParams();
    
    if (filters?.limite) params.append("limite", filters.limite.toString());

    const queryString = params.toString();
    const url = `${API_ROUTES.DASHBOARD.VIAJES_RECIENTES}${queryString ? `?${queryString}` : ""}`;
    
    const response = await this.axiosClient.get<ViajeReciente[]>(url);
    return response.data.data;
  }

  async getBoletosRecientes(filters?: DashboardFilters): Promise<BoletoReciente[]> {
    const params = new URLSearchParams();
    
    if (filters?.limite) params.append("limite", filters.limite.toString());

    const queryString = params.toString();
    const url = `${API_ROUTES.DASHBOARD.BOLETOS_RECIENTES}${queryString ? `?${queryString}` : ""}`;
    
    const response = await this.axiosClient.get<BoletoReciente[]>(url);
    return response.data.data;
  }

  async getOcupacionPorTipoRuta(): Promise<OcupacionPorTipoRuta[]> {
    const response = await this.axiosClient.get<OcupacionPorTipoRuta[]>(
      API_ROUTES.DASHBOARD.OCUPACION_POR_TIPO_RUTA
    );
    return response.data.data;
  }

  async getEstadisticasPorDia(filters?: DashboardFilters): Promise<EstadisticaPorDia[]> {
    const params = new URLSearchParams();
    
    if (filters?.dias) params.append("dias", filters.dias.toString());

    const queryString = params.toString();
    const url = `${API_ROUTES.DASHBOARD.ESTADISTICAS_POR_DIA}${queryString ? `?${queryString}` : ""}`;
    
    const response = await this.axiosClient.get<EstadisticaPorDia[]>(url);
    return response.data.data;
  }

  async getResumenCompleto(): Promise<ResumenCompleto> {
    const response = await this.axiosClient.get<ResumenCompleto>(
      API_ROUTES.DASHBOARD.RESUMEN_COMPLETO
    );
    return response.data.data;
  }
} 