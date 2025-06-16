export interface ConfigTenant {
  id: number;
  clave: string;
  valor: string;
  tipo: string;
  descripcion: string;
  fechaModificacion: string;
  tenantId: number;
}

export interface ConfigTenantResponse {
  data: ConfigTenant[];
  message: string | null;
  error: string | null;
  statusCode: number;
}

export interface CreateConfigTenantDto {
  clave: string;
  valor: string;
  tipo: string;
  descripcion?: string;
}

export interface UpdateConfigTenantDto {
  clave?: string;
  valor?: string;
  tipo?: string;
  descripcion?: string;
}
