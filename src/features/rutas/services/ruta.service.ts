// features/rutas/services/ruta.service.ts
import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";
import type {
  Ruta,
  RutaCreate,
  RutaUpdate,
  RutaFilter,
} from "../interfaces/ruta.interface";

export class RutaService {
  private static instance: RutaService;
  private axiosClient: AxiosClient;

  private constructor() {
    this.axiosClient = AxiosClient.getInstance();
  }

  public static getInstance(): RutaService {
    if (!RutaService.instance) {
      RutaService.instance = new RutaService();
    }
    return RutaService.instance;
  }

  async findAll(filter?: RutaFilter): Promise<Ruta[]> {
    const params = new URLSearchParams();
    
    if (filter?.nombre) params.append("nombre", filter.nombre);
    if (filter?.resolucionId) params.append("resolucionId", filter.resolucionId.toString());
    if (filter?.activo !== undefined) params.append("activo", filter.activo.toString());
    if (filter?.descripcion) params.append("descripcion", filter.descripcion);

    const queryString = params.toString();
    const url = `${API_ROUTES.RUTAS.GET_ALL}${queryString ? `?${queryString}` : ""}`;
    
    const response = await this.axiosClient.get<Ruta[]>(url);
    return response.data.data;
  }

  async findById(id: number): Promise<Ruta> {
    const url = API_ROUTES.RUTAS.GET_BY_ID.replace(":id", id.toString());
    const response = await this.axiosClient.get<Ruta>(url);
    return response.data.data;
  }

  async create(data: RutaCreate): Promise<Ruta> {
    const response = await this.axiosClient.post<Ruta>(API_ROUTES.RUTAS.CREATE, data);
    return response.data.data;
  }

  async update(id: number, data: RutaUpdate): Promise<Ruta> {
    const url = API_ROUTES.RUTAS.UPDATE.replace(":id", id.toString());
    const response = await this.axiosClient.put<Ruta>(url, data);
    return response.data.data;
  }

  async delete(id: number): Promise<void> {
    const url = API_ROUTES.RUTAS.DELETE.replace(":id", id.toString());
    await this.axiosClient.delete(url);
  }
}