export interface Usuario {
  id: number;
  username: string;
  tipoUsuario: string;
  fechaRegistro: string;
  ultimoAcceso: string | null;
  activo: boolean;
}

export interface InfoPersonal {
  id: number;
  usuarioTenantId: number;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  direccion: string;
  ciudadResidencia: string;
  genero: "M" | "F" | "O";
  fotoPerfil: string | null;
  licenciaConducir: string | null;
  tipoLicencia: string | null;
  fechaExpiracionLicencia: string | null;
  fechaContratacion: string;
  fechaRegistro: string;
  ultimaActualizacion: string;
  activo: boolean;
}

export interface UserTenant {
  id: number;
  fechaAsignacion: string;
  tenantId: number;
  rol: string;
  activo: boolean;
  infoPersonal: InfoPersonal | null;
  usuario: Usuario;
}

export interface BaseInfoPersonal {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono?: string;
  email?: string;
  fechaNacimiento?: string;
  direccion?: string;
  ciudadResidencia?: string;
  genero?: "M" | "F" | "O";
  fotoPerfil?: string;
  fechaContratacion?: string;
}

export interface ConductorInfoPersonal extends BaseInfoPersonal {
  licenciaConducir: string;
  tipoLicencia: string;
  fechaExpiracionLicencia: string;
}

export interface CreateUserTenantDto {
  rol: string;
  usuario: {
    username: string;
    password: string;
  };
  infoPersonal: BaseInfoPersonal | ConductorInfoPersonal;
}

export interface UpdateUserTenantDto {
  rol: string;
  usuario: {
    username: string;
    password?: string;
  };
  infoPersonal: BaseInfoPersonal | ConductorInfoPersonal;
}

export interface UserTenantResponse {
  data: UserTenant[];
  message: string | null;
  error: string | null;
  statusCode: number;
}

export interface SRIResponse {
  contribuyente?: {
    nombreComercial: string;
  };
}
