import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";
import type {
  TipoRutaBus,
  TipoRutaBusCreate,
  TipoRutaBusUpdate,
  TipoRutaBusFilter,
} from "../interfaces/tipo-ruta-bus.interface";

export class TipoRutaBusService {
  private static instance: TipoRutaBusService;
  private axiosClient: AxiosClient;

  private constructor() {
    this.axiosClient = AxiosClient.getInstance();
  }

  public static getInstance(): TipoRutaBusService {
    if (!TipoRutaBusService.instance) {
      TipoRutaBusService.instance = new TipoRutaBusService();
    }
    return TipoRutaBusService.instance;
  }

  async findAll(filter?: TipoRutaBusFilter): Promise<TipoRutaBus[]> {
    const params = new URLSearchParams();
    
    if (filter?.nombre) params.append("nombre", filter.nombre);

    const queryString = params.toString();
    const url = `${API_ROUTES.TIPOS_RUTA_BUS.GET_ALL}${queryString ? `?${queryString}` : ""}`;
    
    const response = await this.axiosClient.get<TipoRutaBus[]>(url);
    return response.data.data;
  }

  async findById(id: number): Promise<TipoRutaBus> {
    const url = API_ROUTES.TIPOS_RUTA_BUS.GET_BY_ID.replace(":id", id.toString());
    const response = await this.axiosClient.get<TipoRutaBus>(url);
    return response.data.data;
  }

  async create(data: TipoRutaBusCreate): Promise<TipoRutaBus> {
    const response = await this.axiosClient.post<TipoRutaBus>(API_ROUTES.TIPOS_RUTA_BUS.CREATE, data);
    return response.data.data;
  }

  async update(id: number, data: TipoRutaBusUpdate): Promise<TipoRutaBus> {
    const url = API_ROUTES.TIPOS_RUTA_BUS.UPDATE.replace(":id", id.toString());
    const response = await this.axiosClient.put<TipoRutaBus>(url, data);
    return response.data.data;
  }

  async delete(id: number): Promise<void> {
    const url = API_ROUTES.TIPOS_RUTA_BUS.DELETE.replace(":id", id.toString());
    await this.axiosClient.delete(url);
  }
} 