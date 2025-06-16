// features/resoluciones-ant/services/resolucion-ant.service.ts
import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";
import type {
  ResolucionAnt,
  ResolucionAntCreate,
  ResolucionAntUpdate,
  ResolucionAntFilter,
} from "../interfaces/resolucion-ant.interface";

export class ResolucionAntService {
  private static instance: ResolucionAntService;
  private axiosClient: AxiosClient;

  private constructor() {
    this.axiosClient = AxiosClient.getInstance();
  }

  public static getInstance(): ResolucionAntService {
    if (!ResolucionAntService.instance) {
      ResolucionAntService.instance = new ResolucionAntService();
    }
    return ResolucionAntService.instance;
  }

  async findAll(filter?: ResolucionAntFilter): Promise<ResolucionAnt[]> {
    try {
      const params = new URLSearchParams();
      
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
          }
        });
      }

      const url = `${API_ROUTES.RESOLUCIONES_ANT.GET_ALL}${
        params.toString() ? `?${params.toString()}` : ''
      }`;

      const response = await this.axiosClient.get<ResolucionAnt[]>(url, {params});
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: number): Promise<ResolucionAnt> {
    try {
      const url = API_ROUTES.RESOLUCIONES_ANT.GET_BY_ID.replace(":id", String(id));
      const response = await this.axiosClient.get<ResolucionAnt>(url);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async create(data: ResolucionAntCreate): Promise<ResolucionAnt> {
    try {
      const response = await this.axiosClient.post<ResolucionAnt>(
        API_ROUTES.RESOLUCIONES_ANT.POST,
        data
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, data: ResolucionAntUpdate): Promise<ResolucionAnt> {
    try {
      const url = API_ROUTES.RESOLUCIONES_ANT.UPDATE.replace(":id", String(id));
      const response = await this.axiosClient.put<ResolucionAnt>(
        url,
        data
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const url = API_ROUTES.RESOLUCIONES_ANT.DELETE.replace(":id", String(id));
      await this.axiosClient.delete(url);
    } catch (error) {
      throw error;
    }
  }
}