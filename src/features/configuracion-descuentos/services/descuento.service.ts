import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";
import type {
  Descuento,
  DescuentoCreate,
  DescuentoUpdate,
  DescuentoFilter,
} from "../interfaces/descuento.interface";

export class DescuentoService {
  private static instance: DescuentoService;
  private axiosClient: AxiosClient;

  private constructor() {
    this.axiosClient = AxiosClient.getInstance();
  }

  public static getInstance(): DescuentoService {
    if (!DescuentoService.instance) {
      DescuentoService.instance = new DescuentoService();
    }
    return DescuentoService.instance;
  }

  async findAll(filter?: DescuentoFilter): Promise<Descuento[]> {
    const params = new URLSearchParams();
    
    if (filter?.tipo) params.append("tipo", filter.tipo);
    if (filter?.porcentajeMinimo) params.append("porcentajeMinimo", filter.porcentajeMinimo.toString());
    if (filter?.porcentajeMaximo) params.append("porcentajeMaximo", filter.porcentajeMaximo.toString());
    if (filter?.requiereValidacion !== undefined) params.append("requiereValidacion", filter.requiereValidacion.toString());
    if (filter?.activo !== undefined) params.append("activo", filter.activo.toString());

    const queryString = params.toString();
    const url = `${API_ROUTES.CONFIGURACION_DESCUENTOS.GET_ALL}${queryString ? `?${queryString}` : ""}`;
    
    const response = await this.axiosClient.get<Descuento[]>(url);
    return response.data.data;
  }

  async findById(id: number): Promise<Descuento> {
    const url = API_ROUTES.CONFIGURACION_DESCUENTOS.GET_BY_ID.replace(":id", id.toString());
    const response = await this.axiosClient.get<Descuento>(url);
    return response.data.data;
  }

  async findByTipo(tipo: string): Promise<Descuento> {
    const url = API_ROUTES.CONFIGURACION_DESCUENTOS.GET_BY_TIPO.replace(":tipo", tipo);
    const response = await this.axiosClient.get<Descuento>(url);
    return response.data.data;
  }

  async create(data: DescuentoCreate): Promise<Descuento> {
    const response = await this.axiosClient.post<Descuento>(API_ROUTES.CONFIGURACION_DESCUENTOS.CREATE, data);
    return response.data.data;
  }

  async update(id: number, data: DescuentoUpdate): Promise<Descuento> {
    const url = API_ROUTES.CONFIGURACION_DESCUENTOS.UPDATE.replace(":id", id.toString());
    const response = await this.axiosClient.put<Descuento>(url, data);
    return response.data.data;
  }

  async delete(id: number): Promise<void> {
    const url = API_ROUTES.CONFIGURACION_DESCUENTOS.DELETE.replace(":id", id.toString());
    await this.axiosClient.delete(url);
  }

  async activar(id: number): Promise<void> {
    const url = API_ROUTES.CONFIGURACION_DESCUENTOS.ACTIVAR.replace(":id", id.toString());
    await this.axiosClient.put(url);
  }

  async desactivar(id: number): Promise<void> {
    const url = API_ROUTES.CONFIGURACION_DESCUENTOS.DESACTIVAR.replace(":id", id.toString());
    await this.axiosClient.put(url);
  }
} 