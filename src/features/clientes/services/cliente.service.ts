import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";
import type {
  Cliente,
  ClienteCreate,
  ClienteUpdate,
  ClienteFilter,
} from "../interfaces/cliente.interface";

export class ClienteService {
  private static instance: ClienteService;
  private axiosClient: AxiosClient;

  private constructor() {
    this.axiosClient = AxiosClient.getInstance();
  }

  public static getInstance(): ClienteService {
    if (!ClienteService.instance) {
      ClienteService.instance = new ClienteService();
    }
    return ClienteService.instance;
  }

  async findAll(filter?: ClienteFilter): Promise<Cliente[]> {
    const params = new URLSearchParams();
    
    if (filter?.nombres) params.append("nombres", filter.nombres);
    if (filter?.apellidos) params.append("apellidos", filter.apellidos);
    if (filter?.tipoDocumento) params.append("tipoDocumento", filter.tipoDocumento);
    if (filter?.numeroDocumento) params.append("numeroDocumento", filter.numeroDocumento);
    if (filter?.telefono) params.append("telefono", filter.telefono);
    if (filter?.email) params.append("email", filter.email);
    if (filter?.esDiscapacitado !== undefined) params.append("esDiscapacitado", filter.esDiscapacitado.toString());
    if (filter?.activo !== undefined) params.append("activo", filter.activo.toString());

    const queryString = params.toString();
    const url = `${API_ROUTES.CLIENTES.GET_ALL}${queryString ? `?${queryString}` : ""}`;
    
    const response = await this.axiosClient.get<Cliente[]>(url);
    return response.data.data;
  }

  async findById(id: number): Promise<Cliente> {
    const url = API_ROUTES.CLIENTES.GET_BY_ID.replace(":id", id.toString());
    const response = await this.axiosClient.get<Cliente>(url);
    return response.data.data;
  }

  async create(data: ClienteCreate): Promise<Cliente> {
    const response = await this.axiosClient.post<Cliente>(API_ROUTES.CLIENTES.CREATE, data);
    return response.data.data;
  }

  async update(id: number, data: ClienteUpdate): Promise<Cliente> {
    const url = API_ROUTES.CLIENTES.UPDATE.replace(":id", id.toString());
    const response = await this.axiosClient.put<Cliente>(url, data);
    return response.data.data;
  }

  async delete(id: number): Promise<void> {
    const url = API_ROUTES.CLIENTES.DELETE.replace(":id", id.toString());
    await this.axiosClient.delete(url);
  }
} 