
export interface Tenant {
    id: number;
    nombre: string;
    identificador: string;
    logoUrl: string;
    colorPrimario: string;
    colorSecundario: string;
    sitioWeb: string;
    emailContacto: string;
    telefono: string;
}


export interface ApiResponse<T> {
    data: T;
    message: string | null;
    error: string | null;
    statusCode: number;
  }
  
  export type TenantResponse = ApiResponse<Tenant>;